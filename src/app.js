import express from "express";
import path from "path";
import { mongoConnection } from "./common/config/database.config";
import handleError from "./common/middlewares/error-handler.middleware";
import routes from "../routes/index";
import swaggerSetup from "./common/config/swagger.config";
import passport from "passport";
import "./common/config/jwt-strategy";
import cors from "cors";

require("dotenv").config();

const app = express();
mongoConnection();

app.set("view engine", "ejs");
app.set("views", path.join(`${__dirname}../../src`, "views"));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../public")));
app.use("/media", express.static(path.join(__dirname, "../media")));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOptions = { origin: process.env.ALLOW_ORIGIN };
app.use(cors(corsOptions));

app.use(swaggerSetup);
app.use("/", routes);
app.use(handleError);

app.get("/test", (req, res) => {
  return res.send({ message: "test successfully" });
});

var http = require("http").Server(app);

http.listen(process.env.PORT || 6001, () => {
  console.log(`listening at ${process.env.BASE_URL}:${process.env.PORT}`);
});
