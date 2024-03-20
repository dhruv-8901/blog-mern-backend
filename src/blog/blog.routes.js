import express from "express";
import asyncHandler from "express-async-handler";
import BlogController from "./blog.controller";
import storeFiles from "../common/middlewares/storeFile";
import validator from "../common/config/joi-validator";
import blogIdDto from "./dtos/blogId.dto";
const router = express.Router();

router.put(
  "/:blogId",
  asyncHandler(storeFiles("media/blog", "image")),
  validator.params(blogIdDto),
  asyncHandler(BlogController.updateBlogById)
);

router.get(
  "/:blogId",
  validator.params(blogIdDto),
  asyncHandler(BlogController.getBlogDataById)
);

router.delete(
  "/:blogId",
  validator.params(blogIdDto),
  asyncHandler(BlogController.deleteBlogById)
);

router.get("/", asyncHandler(BlogController.getAllBlog));

router.post(
  "/",
  asyncHandler(storeFiles("media/blog", "image")),
  asyncHandler(BlogController.addBlog)
);

export default router;
