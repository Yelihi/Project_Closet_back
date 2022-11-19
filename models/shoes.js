module.exports = (sequelize, DataTypes) => {
  const Shoes = sequelize.define(
    "Shoes",
    {
      size: {
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
  Shoes.associate = (db) => {
    db.Shoes.belongsTo(db.Cloth);
  };

  return Shoes;
};
