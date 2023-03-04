const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const { isLoggedIn } = require("./middlewares");

const { User, Cloth, Image, Muffler, Outer, Pant, Shirt, Shoe, Top } = require("../models");

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

const getCatagori = {
  Top: async function (cloth, req) {
    const top = await Top.postTopbyReq(req);
    await cloth.setTop(top);
  },
  Outer: async function (cloth, req) {
    const outer = await Outer.postOuterbyReq(req);
    await cloth.setOuter(outer);
  },
  Shirt: async function (cloth, req) {
    const shirt = await Shirt.postShirtbyReq(req);
    await cloth.setShirt(shirt);
  },
  Pant: async function (cloth, req) {
    const pant = await Pant.postPantbyReq(req);
    await cloth.setPant(pant);
  },
  Shoes: async function (cloth, req) {
    const shoe = await Shoe.postShoesbyReq(req);
    await cloth.setShoe(shoe);
  },
  Muffler: async function (cloth, req) {
    const muffler = await Muffler.postMufflerbyReq(req);
    await cloth.setMuffler(muffler);
  },
};

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
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image.filename })));
        await cloth.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image[0].filename });
        await cloth.addImages(image);
      }
    }
    getCatagori[req.body.categori](cloth, req);
    const reverseId = await Cloth.findOne({
      where: { id: cloth.id },
    });
    res.status(200).json(reverseId);
  } catch (err) {
    console.error(err);
    next(err);
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
