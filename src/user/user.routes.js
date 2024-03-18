import express from "express";
import asyncHandler from "express-async-handler";
import validator from "../common/config/joi-validator";
import authentication from "../common/middlewares/authentication";
import UserServices from "./user.service";
import UserController from "./user.controller";
import updateUserDto from "./dtos/update-user.dto";
import storeMultipleFile from "../common/middlewares/storeMultipleFile";
const router = express.Router();

router.delete("/delete", asyncHandler(UserController.deleteUserAccount));

router.put(
  "/",
  asyncHandler(
    storeMultipleFile([
      { destination: "media/recruiter", name: "profileImage", maxCount: 1 },
      { destination: "media/resume", name: "resume", maxCount: 1 },
    ])
  ),
  validator.body(updateUserDto),
  asyncHandler(UserController.updateUserData)
);

router.get("/", asyncHandler(UserController.getUserData));

export default router;
