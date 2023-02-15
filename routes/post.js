const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const { isLoggedIn } = require("./middlewares");

const { Cloth, Image, Muffler, Outer, Pant, Shirt, Shoes, Top } = require("../models");

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

router.post("/images", isLoggedIn, upload.array("image"), async (req, res, next) => {
  // POST /post/images
  try {
    const filename = path.resolve(__dirname, `../uploads/${req.files[0].filename}`);
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
      filename: req.files.map((v) => v.filename),
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
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await cloth.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await cloth.addImages(image);
      }
    }
    switch (req.body.categori) {
      case "Top": {
        const top = await Top.postTopbyReq(req);
        await cloth.addTop(top);
        break;
      }
      case "Outer": {
        const outer = await Outer.postOuterbyReq(req);
        await cloth.addOuter(outer);
        break;
      }
      case "Shirt": {
        const shirt = await Shirt.postShirtbyReq(req);
        await cloth.addShirt(shirt);
        break;
      }
      case "Pant": {
        const pant = await Pant.postPantbyReq(req);
        await cloth.addPant(pant);
        break;
      }
      case "Shoes": {
        const shoes = await Shoes.postShoesbyReq(req);
        await cloth.addShoes(shoes);
        break;
      }
      case "Muffler": {
        const muffler = await Muffler.postMufflerbyReq(req);
        await cloth.addMuffler(muffler);
        break;
      }
    }
    res.status(200).send("데이터가 잘 들어갔습니다.");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
