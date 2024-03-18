import express from "express";
import { serve, setup } from "swagger-ui-express";
import { baseUrl } from "./constant.config";

const YAML = require("yamljs");

const router = express.Router();
const swaggerDocument = YAML.load("swagger.yaml");
const recruiterDocument = YAML.load("recruiter.yaml");
const AdminSwaggerDocument = YAML.load("admin.yaml");

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

  router.use(
    "/recruiter/api/documentation",
    (req, res, next) => {
      recruiterDocument.info.title = `${process.env.APP_NAME} - Recruiter`;
      recruiterDocument.servers = [
        {
          url: baseUrl() + "/api/v1",
          description: "API base url",
        },
      ];
      req.swaggerDoc = recruiterDocument;
      next();
    },
    serve,
    setup(recruiterDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );

  router.use(
    "/admin/api/documentation",
    (req, res, next) => {
      AdminSwaggerDocument.info.title = `${process.env.APP_NAME} - Admin`;
      AdminSwaggerDocument.servers = [
        {
          url: baseUrl() + "/admin/api/v1",
          description: "API base url",
        },
      ];
      req.swaggerDoc = AdminSwaggerDocument;
      next();
    },
    serve,
    setup(AdminSwaggerDocument, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
}
export default router;
