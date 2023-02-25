const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Cloth extends Model {
  static init(sequelize) {
    return super.init(
      {
        productName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unigue: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        categori: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
        purchaseDay: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        // 유저 모델에 대한 셋팅
        modelName: "Cloth",
        tableName: "cloths",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static postClothbyReq = async (req) => {
    const result = await this.create({
      productName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      color: req.body.color,
      categori: req.body.categori,
      purchaseDay: req.body.purchaseDay,
      UserId: req.user.id,
    });
    return result;
  };

  static associate(db) {
    db.Cloth.belongsTo(db.User);
    db.Cloth.hasMany(db.Image);
    db.Cloth.hasOne(db.Outer);
    db.Cloth.hasOne(db.Shirt);
    db.Cloth.hasOne(db.Top);
    db.Cloth.hasOne(db.Pant);
    db.Cloth.hasOne(db.Shoe);
    db.Cloth.hasOne(db.Muffler);
  }
};
