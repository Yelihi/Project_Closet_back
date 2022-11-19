const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = require("./user")(sequelize, Sequelize);
db.Cloth = require("./cloth")(sequelize, Sequelize);
db.Outer = require("./outer")(sequelize, Sequelize);
db.Shirt = require("./shirt")(sequelize, Sequelize);
db.Top = require("./top")(sequelize, Sequelize);
db.Pant = require("./pant")(sequelize, Sequelize);
db.Shoes = require("./shoes")(sequelize, Sequelize);
db.Muffler = require("./muffler")(sequelize, Sequelize);
db.Image = require("./image")(sequelize, Sequelize);

// associtate 부분을 실행시켜주는 부분
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
