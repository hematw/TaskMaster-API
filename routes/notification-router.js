import { Router } from "express"
import { getAllNotifications, readNotification } from "../controllers/notification-controller.js"

const notifyRouter = Router()

notifyRouter.get("/", getAllNotifications)
notifyRouter.post("/:id", readNotification)

export default notifyRouter;