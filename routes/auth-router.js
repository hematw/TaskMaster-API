import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/auth-controller.js";

const authRouter = Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.get("/signout", logoutUser);

export default authRouter;
