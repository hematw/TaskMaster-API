import Notification from "../models/Notification.js"

export const getAllNotifications = async (req, res) => {
    console.log(req.user)
    const notifications = await Notification.find({ recipient: req.user._id })
    res.status(200).json({ message: "Notication is here", notifications })
}

export const readNotification = async (req, res) => {
    const notifyId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(notifyId, { unread: false })
    res.status(200).json({ message: "Notification has been read", notification })
}