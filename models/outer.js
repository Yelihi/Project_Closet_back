module.exports = (sequelize, DataTypes) => {
  const Outer = sequelize.define(
    "Outer",
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
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  Outer.associate = (db) => {
    db.Outer.belongsTo(db.Cloth);
  };

  return Outer;
};
