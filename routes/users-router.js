import { Router } from "express";
import multer from "multer";
import storage from "../utils/multer-storage.js";
import {
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/users-controller.js";

const upload = multer({ storage });

const usersRouter = Router();

usersRouter
  .route("/")
  .get(getAllUsers)
  .patch(upload.single("profile"), updateUser);

usersRouter.route("/:userId").get(getUser);

export default usersRouter;
