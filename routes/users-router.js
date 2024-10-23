import { Router } from "express";
import multer from "multer";
import { getAllUsers, updateUser } from "../controllers/users-controller.js";
import storage from "../utils/multer-storage.js";

const upload = multer({storage});

const usersRouter = Router();

usersRouter
  .route("/")
  .get(getAllUsers)
  .patch(upload.single("profile"), updateUser);

export default usersRouter;
