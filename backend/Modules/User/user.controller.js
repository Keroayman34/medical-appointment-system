import User from "../../Database/Models/user.model.js";

// Admin: Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// Get my profile
export const getMyProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// Admin: Block or Unblock user
export const toggleBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: user.isActive
        ? "User unblocked successfully"
        : "User blocked successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
