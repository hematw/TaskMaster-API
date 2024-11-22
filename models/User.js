import { model, Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
    },
    dob: {
      type: Date,
      required: [true, "Please provide your date of birth"],
    },
    country: {
      type: String,
      required: [true, "Please provide country"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    profile: {
      type: String,
      default: "./profiles/demo_profile.jfif",
    },
    resetToken: {
      type: Types.ObjectId,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();
  if (update && update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

UserSchema.methods.isPasswordCorrect = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

UserSchema.methods.generateToken = async function () {
  const jwtSecret = process.env.MY_JWT_SECRET;
  const jwtLifetime = process.env.JWT_LIFETIME;
  return await jwt.sign({ _id: this._id, username: this.username }, jwtSecret, {
    expiresIn: jwtLifetime,
  });
};

const User = model("User", UserSchema);
export default User;
