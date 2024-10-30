import { model, Schema } from "mongoose";

const ResetPasswordTokenSchema = new Schema({
  token: String,
  expiresIn: Date,
});

export default model("ResetPasswordToken", ResetPasswordTokenSchema);
