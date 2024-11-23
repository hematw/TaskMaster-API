import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    },
    isRead: {
        type: Boolean,
        default: false
    },
    recipient: {
        type: mongoose.Types.ObjectId,
        required: [true, "Recipient is required"]
    },
})

export default mongoose.model("Notification", NotificationSchema)