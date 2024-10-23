import NotFoundError from "../errors/not-found.js";
import UnauthorizedError from "../errors/unauthorized.js";
import User from "../models/User.js";

// Get all users data
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("firstName lastName profile");
  if (users.length) {
    return res.status(200).json({ success: true, users });
  }
  throw NotFoundError("No user exists!");
};

// Update user
export const updateUser = async (req, res) => {
  const { firstName, lastName, dob, country, currentPassword, newPassword } =
    req.body;
  console.log("✨", req.file);
  console.log(req.body);
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
    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.dob = dob ? dob : user.dob;
    user.country = country ? country : user.country;
    user.password = newPassword ? newPassword : user.password;
    
    const profileImagePath =
      `${req.protocol}://${req.hostname}:${process.env.PORT}` +
      req.file?.destination
        .replace("public", "")
        .concat("/" + req.file?.filename);
    user.profile = profileImagePath;

    await user.save();
    
    return res
      .status(202)
      .json({ status: true, message: "User updated successfully" });
  }
  throw new UnauthorizedError("Password was incorrect!");
};
