module.exports = (sequelize, DataTypes) => {
  const Cloth = sequelize.define(
    "Cloth",
    {
      productName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unigue: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      categori: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      purchaseDay: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // 유저 모델에 대한 셋팅
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  Cloth.associate = (db) => {
    db.Cloth.belongsTo(db.User);
    db.Cloth.hasMany(db.Image);
    db.Cloth.hasOne(db.Outer);
    db.Cloth.hasOne(db.Shirt);
    db.Cloth.hasOne(db.Top);
    db.Cloth.hasOne(db.Pant);
    db.Cloth.hasOne(db.Shoes);
    db.Cloth.hasOne(db.Muffler);
  };

  return Cloth;
};
