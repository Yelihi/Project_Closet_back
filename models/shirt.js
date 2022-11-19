module.exports = (sequelize, DataTypes) => {
  const Shirt = sequelize.define(
    "Shirt",
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
  Shirt.associate = (db) => {
    db.Shirt.belongsTo(db.Cloth);
  };

  return Shirt;
};
