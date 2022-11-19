module.exports = (sequelize, DataTypes) => {
  const Pant = sequelize.define(
    "Pant",
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
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  Pant.associate = (db) => {
    db.Pant.belongsTo(db.Cloth);
  };

  return Pant;
};
