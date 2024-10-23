import UnauthorizedError from "../errors/unauthorized.js";
import User from "../models/User.js";

const cookieOptions = {
  expiresAt: 7 * 24 * 60 * 60 * 1000, // seven days
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
      success: true,
      token,
      createdUser: { ...createdUser, password: undefined },
    });
};
// );

// Login route controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email });
  console.log(foundUser);
  if (foundUser && (await foundUser.isPasswordCorrect(password))) {
    const token = await foundUser.generateToken();
    // const tokenToSave
    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
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
    .json({ success: true, message: "Logged out successfully" });
};
