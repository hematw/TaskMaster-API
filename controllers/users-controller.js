import NotFoundError from "../errors/not-found.js";
import UnauthorizedError from "../errors/unauthorized.js";
import User from "../models/User.js";
import deleteOldProfile from "../utils/delete-old-profile.js";

// Get all users data
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("firstName lastName profile");
  if (users.length) {
    return res.status(200).json({ users });
  }
  throw NotFoundError("No user exists!");
};

// Update user
export const updateUser = async (req, res) => {
  const { firstName, lastName, dob, country, currentPassword, newPassword } =
    req.body;
  if (!currentPassword) {
    throw new UnauthorizedError(
      "Provide your current password to update user data!"
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError("No logged in user found!");
  }

  if (await user.isPasswordCorrect(currentPassword)) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.dob = dob || user.dob;
    user.country = country || user.country;
    user.password = newPassword || user.password;

    
    if (req.file) {
      const profileImagePath =
      `${req.protocol}://${req.hostname}:${process.env.PORT}` +
      req.file?.destination
      .replace("public", "")
      .concat("/" + req.file?.filename);
      deleteOldProfile(user.profile);
      user.profile = profileImagePath;
    }
    
    await user.save();

    return res.status(202).json({ message: "User updated successfully", user });
  }
  throw new UnauthorizedError("Password was incorrect!");
};

// Get user's data by userId (router parameter)
export const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (user) {
    return res.status(200).json({ user });
  }
  throw NotFoundError("No user found!");
};
