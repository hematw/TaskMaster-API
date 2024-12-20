import BadRequest from "../errors/bad-request.js";
import NotFoundError from "../errors/not-found.js";
import UnauthorizedError from "../errors/unauthorized.js";
import ResetPasswordToken from "../models/ResetPasswordToken.js";
import User from "../models/User.js";
import crypto from "crypto";
import sendMail from "../utils/email-sender.js";

const cookieOptions = {
  // maxAge: 7 * 24 * 60 * 60 * 1000, // seven days (max age accepts time in ml seconds)
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // seven days (and expires accepts time in date objects form)
  httpOnly: true,
  secure: true,
};

// Register route controller
export const registerUser = async (req, res) => {
  const createdUser = await User.create({
    ...req.body,
    profile: `${req.protocol}://${req.hostname}:${req.port}/profiles/demo_profile.jfif`,
  });
  const token = await createdUser.generateToken();
  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json({
      token,
      user: { ...createdUser, password: undefined },
    });
};

// Login route controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  console.log(foundUser);
  if (foundUser && (await foundUser.isPasswordCorrect(password))) {
    const token = await foundUser.generateToken();
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        token,
        user: { ...foundUser.toJSON(), password: undefined },
      });
  }
  throw new UnauthorizedError("Email or password was wrong!");
};

// Logout route controller
export const logoutUser = async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", { ...cookieOptions, expires: undefined })
    .json({ message: "Logged out successfully" });
};

// Forgot Password controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("Provide your email");
  }

  const userWithEmail = await User.findOne({ email });
  if (!userWithEmail) {
    throw NotFoundError("No user found with provided email");
  }

  const resetToken = await ResetPasswordToken.create({
    token: crypto.randomBytes(32).toString("hex"),
    expiresIn: Date.now() + 24 * 60 * 60 * 1000,
  });

  userWithEmail.resetToken = resetToken._id;
  await userWithEmail.save();

  const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken.token}&user=${userWithEmail._id}`;

  await sendMail(userWithEmail, url);
  res.status(200).json({
    message: "A password reset was sent to your email",
  });
};

export const resetPassword = async (req, res) => {
  const { token, user } = req.query;
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new BadRequest("Bad request with invalid data");
  }

  const resetToken = await ResetPasswordToken.findOne({ token: token });

  const presentTime = Date.now();
  if (!resetToken && presentTime < token.expiresIn) {
    throw new UnauthorizedError("Reset password token is invalid");
  }

  const requestedUser = await User.updateOne({ _id: user }, { password });
  res.status(202).json({ message: "Password has been successfully changed" });
};

export const googleLogin = async (req, res) => {
  const { access_token } = req.body;
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  const data = await response.json();
  console.log(data);
  const userWithGmail = await User.findOne({ email: data.email });
  if (!userWithGmail) {
    userWithGmail = await User.create({
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      profile: data.picture,
      password: data.name,
    });
  }

  const token = await userWithGmail.generateToken();
  res
    .cookie("token", token, cookieOptions)
    .status(200)
    .json({ token, user: userWithGmail, message: "Google login successfully" });
};
