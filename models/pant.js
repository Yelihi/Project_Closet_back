const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Pant extends Model {
  static init(sequelize) {
    return super.init(
      {
        totalLength: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        rise: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        hem: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        waist: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        thigh: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        // 유저 모델에 대한 셋팅
        modelName: "Pant",
        tableName: "pants",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static postPantbyReq = async (req) => {
    const result = await this.create({
      totalLength: req.body.categoriItem.totalLength,
      rise: req.body.categoriItem.rise,
      hem: req.body.categoriItem.hem,
      waist: req.body.categoriItem.waist,
      thigh: req.body.categoriItem.thigh,
    });
    return result;
  };

  static associate(db) {
    db.Pant.belongsTo(db.Cloth);
  }
};
