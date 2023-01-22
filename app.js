const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const googleRouter = require("./routes/auth");
const db = require("./models");

const passport = require("passport");
const passportConfig = require("./passport");

const app = express();

dotenv.config();
passportConfig();

db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRouter);
app.use("/auth", googleRouter);

app.listen(3065, () => {
  console.log("서버 실행 중!");
});
