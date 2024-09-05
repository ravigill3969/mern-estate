import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  // Check if the authenticated user is the same as the user being updated
  if (req.user.id != req.params.id) {
    return next(errorHandler(401, "You can only update your own account"));
  }

  try {
    // Hash the password if it's being updated
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 12);
    }

    // Find the user and update their information
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    // If user not found, return an error
    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Remove the password from the returned user object
    const { password: pass, ...rest } = updatedUser._doc;

    // Send the updated user info without the password
    return res.status(200).json(rest);
  } catch (error) {
    // Pass the error to the next middleware (error handler)
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  // Check if the authenticated user is the same as the user being deleted
  if (req.user.id != req.params.id) {
    return next(errorHandler(401, "You can only delete your own account"));
  }

  try {
    // Find the user and delete their account
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    // If user not found, return an error
    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Send a success message
    return res
      .clearCookie("access_token")
      .status(200)
      .json("User deleted successfully");
  } catch (error) {
    // Pass the error to the next middleware (error handler)
    return next(error);
  }
};
