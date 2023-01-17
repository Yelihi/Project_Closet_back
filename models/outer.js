const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Outer extends Model {
  static init(sequelize) {
    return super.init(
      {
        shoulder: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        arm: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        totalLength: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        chest: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        // 유저 모델에 대한 셋팅
        modelName: "Outer",
        tableName: "outers",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Outer.belongsTo(db.Cloth);
  }
};