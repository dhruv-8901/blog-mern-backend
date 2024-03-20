import express from "express";
import asyncHandler from "express-async-handler";
import PasswordController from "./password.controller";
import validator from "../common/config/joi-validator";
import resetPasswordDto from "./dtos/reset-password-dto";
import changePasswordDto from "./dtos/change-password-dto";
import authentication from "../common/middlewares/authentication";
const router = express.Router();

router.post("/forgot", asyncHandler(PasswordController.forgotPassword));

router.post(
  "/forgot-otp-verification",
  asyncHandler(PasswordController.forgotOtpVerification)
);

router.post(
  "/reset",
  authentication,
  validator.body(resetPasswordDto),
  asyncHandler(PasswordController.resetPassword)
);

router.post(
  "/change",
  authentication,
  validator.body(changePasswordDto),
  asyncHandler(PasswordController.changePassword)
);

export default router;
