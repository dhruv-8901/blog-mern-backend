import express from "express";
import authRoutes from "../src/auth/auth.routes";
import passwordRoutes from "../src/password/password.routes";
import authentication from "../src/common/middlewares/authentication";
import blogRoutes from "../src/blog/blog.routes";
import userRoutes from "../src/user/user.routes"

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/blog", authentication, blogRoutes);

router.use("/user", authentication, userRoutes);

router.use("/password", passwordRoutes);

export default router;
