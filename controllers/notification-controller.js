import Notification from "../models/Notification.js"

export const getAllNotifications = async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user.id })
    res.status(200).json({ notifications })
}

export const readNotification = async (req, res) => {
    const notifyId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(notifyId, { isRead: true })
    res.status(200).json({ message: "Notification has been read", notification })
}