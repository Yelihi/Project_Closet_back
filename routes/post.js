const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models");
const vision = require("@google-cloud/vision");
const { isLoggedIn } = require("./middlewares");

const { User, Cloth, Image, Muffler, Outer, Pant, Shirt, Shoe, Top } = require("../models");
const getCatagori = require("../core/utils");

const router = express.Router();

const client = new vision.ImageAnnotatorClient({
  keyFilename: "APIKEY.json",
});

try {
  fs.accessSync("uploads");
} catch (err) {
  console.log("upload 폴더가 없으니 생산합니다");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      // 원래 파일에서 원익.jpg 로 오게 되면
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + "_" + new Date().getTime() + ext); // 원익23123.jpg
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20mb
});

router.post("/images", isLoggedIn, upload.single("image"), async (req, res, next) => {
  // POST /post/images 파일 한개씩 업로드
  console.log(req.file);
  try {
    const filename = path.resolve(__dirname, `../uploads/${req.file.filename}`);
    const request = {
      image: { content: fs.readFileSync(filename) },
    };
    const [result] = await client.objectLocalization(request);
    const objects = result.localizedObjectAnnotations;
    const resArray = [];
    objects.forEach((object) => {
      let obj = { name: object.name, confidence: object.score };
      resArray.push(obj);
    });
    const resultObject = {
      filename: req.file.filename,
      visionSearch: resArray,
    };
    res.status(200).json(resultObject);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/clothes", isLoggedIn, upload.none(), async (req, res, next) => {
  // POST /post/clothes
  try {
    const cloth = await Cloth.postClothbyReq(req);
    if (req.body.items.image) {
      if (Array.isArray(req.body.itmes.image)) {
        const images = await Promise.all(req.body.items.image.map((image) => Image.create({ src: image.filename })));
        await cloth.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.items.image[0].filename });
        await cloth.addImages(image);
      }
    }
    getCatagori[req.body.items.categori]["post"](cloth, req);
    const reverseId = await Cloth.findOne({
      where: { id: cloth.id },
    });
    res.status(200).json(reverseId);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/clothes/:clothId", isLoggedIn, async (req, res, next) => {
  try {
    const cloth = await Cloth.findOne({
      where: { id: req.params.clothId },
      include: [Outer, Top, Pant, Shirt, Shoe, Muffler, Image],
    });
    if (!cloth) {
      return res.status(403).send("의류가 존재하지 않습니다.");
    }
    await Cloth.update(
      {
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        color: req.body.color,
        categori: req.body.categori,
        purchaseDay: req.body.purchaseDay,
        UserId: req.user.id,
      },
      {
        where: { id: req.params.clothId },
      }
    );

    // categori 에 따른 업데이트
    if (req.body.items.categori !== cloth.categori) {
      await db[cloth.categori].destroy({ where: { ClothId: req.params.clothId } });
      getCatagori[req.body.items.categori]["postWithId"](cloth, req);
    } else if (req.body.items.categori === cloth.categori) {
      getCatagori[req.body.items.categori]["update"](req, req.params.clothId);
    }

    // image 업데이트
    if (req.body.items.image) {
      const existingImages = await Image.findAll({ where: { ClothId: req.params.clothId } });
      const filenameArray = req.body.items.image.map((v) => v.filename);

      const imagesToRemove = existingImages.filter((img) => !filenameArray.include(img.src));
      await Promise.all(imagesToRemove.map((imgSrc) => Image.destroy({ where: { src: imgSrc } })));

      const imagesToAdd = filenameArray.filter((img) => !existingImages.some((ei) => ei.src === img));
      await Promise.all(imagesToAdd.map((image) => Image.create({ src: image.filename, ClothId: req.params.clothId })));
    }

    res.status(200).send("데이터를 수정하였습니다");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/clothes/:clothId", isLoggedIn, async (req, res, next) => {
  try {
    const cloth = await Cloth.findOne({
      where: { id: req.params.clothId },
      include: [
        Outer,
        Top,
        Pant,
        Shirt,
        Shoe,
        Muffler,
        Image,
        {
          model: User,
          attributes: ["id"],
        },
      ],
    });
    if (!cloth) {
      return res.status(403).send("의류가 존재하지 않습니다.");
    }
    res.status(200).json(cloth);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
