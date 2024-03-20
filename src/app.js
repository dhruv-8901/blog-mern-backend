import express from "express";
import fs from "fs";
require("dotenv").config();
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/test", (req, res) => {
  return res.send({ message: "hello" });
});

var http = require("http").Server(app);

http.listen(process.env.PORT, () => {
  console.log(`listening at ${process.env.BASE_URL}:${process.env.PORT}`);
});
