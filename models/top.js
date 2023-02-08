const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Top extends Model {
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
        modelName: "Top",
        tableName: "tops",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }

  static postTopbyReq = async (req) => {
    const result = await this.create({
      shoulder: req.body.shoulder,
      arm: req.body.arm,
      totalLength: req.body.totalLength,
      chest: req.body.chest,
    });
    return result;
  };

  static associate(db) {
    db.Top.belongsTo(db.Cloth);
  }
};
