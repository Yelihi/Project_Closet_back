const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models");
const { Op } = require("sequelize");

const { isLoggedIn } = require("./middlewares");

const { User, Cloth, Image, Muffler, Outer, Pant, Shirt, Shoe, Top } = require("../models");

const router = express.Router();

const currentDate = new Date();
const currentMonth = currentDate.getMonth();

router.get("/clothes/store/", isLoggedIn, async (req, res, next) => {
  try {
    let where = { UserId: req.user.id };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const userClothes = await Cloth.findAll({
      where,
      limit: 9,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Image,
          attributes: ["id", "ClothId", "src"],
        },
      ],
    });

    if (!userClothes) {
      return res.status(400).send("해당 유저의 의류가 없습니다.");
    }

    res.status(200).json(userClothes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 처음 store 페이지 라우팅 될 때
// 총 길이와 함꼐, 9개의 데이터를 건내주어야 한다.
router.get("/clothes/:id", isLoggedIn, async (req, res, next) => {
  try {
    const clothes = await Cloth.findAll({
      where: { UserId: req.params.id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Image,
          attributes: ["id", "ClothId", "src"],
        },
      ],
    });
    const lastClothes = await Cloth.findAll({
      where: {
        UserId: req.params.id,
        purchaseDay: {
          [Op.lt]: new Date(currentDate.getFullYear(), currentMonth, 1),
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Image,
          attributes: ["id", "ClothId", "src"],
        },
      ],
    });
    if (!clothes) {
      return res.status(400).send("데이터가 존재하지 않습니다.");
    }
    if (!lastClothes) {
      return res.status(400).send("데이터가 존재하지 않습니다.");
    }
    console.log("clothes", clothes[0]);
    let filterObj = {};
    let lastFilterObj = {};
    clothes.forEach((cloth) => {
      if (filterObj[cloth.dataValues.categori] === undefined) {
        filterObj[cloth.dataValues.categori] = 1;
      } else {
        filterObj[cloth.dataValues.categori]++;
      }
    });
    lastClothes.forEach((cloth) => {
      if (lastFilterObj[cloth.dataValues.categori] === undefined) {
        lastFilterObj[cloth.dataValues.categori] = 1;
      } else {
        lastFilterObj[cloth.dataValues.categori]++;
      }
    });
    console.log("fiolterObj", filterObj);
    let maxCategori = Object.entries(filterObj).sort((a, b) => b[1] - a[1])[0][0];
    let lastMaxCategori = Object.entries(lastFilterObj).sort((a, b) => b[1] - a[1])[0][0];

    const result = {
      items: clothes.slice(0, 9), // 9개
      total: clothes.length, // clothes 는 전체 데이터
      lastTotal: lastClothes.length,
      price: clothes.reduce((acc, crr, idx) => acc + crr.price, 0),
      lastPrice: lastClothes.reduce((acc, crr, idx) => acc + crr.price, 0),
      categori: maxCategori,
      categoriNum: filterObj[maxCategori],
      lastCategoriNum: lastFilterObj[lastMaxCategori],
      idArray: clothes.map((v) => v.id),
    };
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
