const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Muffler extends Model {
  static init(sequelize) {
    return super.init(
      {
        totalLength: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        // 유저 모델에 대한 셋팅
        modelName: "Muffler",
        tableName: "mufflers",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static postMufflerbyReq = async (req) => {
    const result = await this.create({
      totalLength: req.body.totalLength,
    });
    return result;
  };

  static associate(db) {
    db.Muffler.belongsTo(db.Cloth);
  }
};
