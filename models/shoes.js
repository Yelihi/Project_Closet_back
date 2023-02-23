const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Shoes extends Model {
  static init(sequelize) {
    return super.init(
      {
        size: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        // 유저 모델에 대한 셋팅
        modelName: "Shoe",
        tableName: "shoes",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static postShoesbyReq = async (req) => {
    const result = await this.create({
      size: req.body.categoriItem.size,
    });
    return result;
  };

  static associate(db) {
    db.Shoes.belongsTo(db.Cloth);
  }
};
