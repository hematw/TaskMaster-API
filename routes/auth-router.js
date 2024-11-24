import { Router } from "express";
import {
  forgotPassword,
  googleLogin,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.get("/signout", logoutUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/google", googleLogin);

export default authRouter;
