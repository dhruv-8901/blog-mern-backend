import express from "express";
import { serve, setup } from "swagger-ui-express";
import { baseUrl } from "./constant.config";

const YAML = require("yamljs");

const router = express.Router();
console.log("in");
const swaggerDocument = YAML.load("swagger.yaml");
console.log("in2", swaggerDocument);

if (process.env.ENV !== "production") {
  router.use(
    "/api/documentation",
    (req, res, next) => {
      swaggerDocument.info.title = process.env.APP_NAME;
      swaggerDocument.servers = [
        {
          url: baseUrl() + "/api/v1",
          description: "API base url",
        },
      ];
      req.swaggerDoc = swaggerDocument;
      next();
    },
    serve,
    setup(swaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
}
export default router;
