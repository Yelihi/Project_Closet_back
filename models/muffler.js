module.exports = (sequelize, DataTypes) => {
  const Muffler = sequelize.define(
    "Muffler",
    {
      totalLength: {
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
  Muffler.associate = (db) => {
    db.Muffler.belongsTo(db.Cloth);
  };

  return Muffler;
};
