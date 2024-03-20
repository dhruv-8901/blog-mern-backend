import express from "express";
import AuthController from "./auth.controller";
import asyncHandler from "express-async-handler";
import authentication from "../common/middlewares/authentication";

const router = express.Router();

router.post("/login", asyncHandler(AuthController.loginUser));

router.post("/signup", asyncHandler(AuthController.signupUser));

router.post("/logout", authentication, asyncHandler(AuthController.logoutUser));

export default router;
