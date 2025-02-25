const User = require('../models/User'); 

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Optionally, prevent admin from deleting themselves:
    if (req.user.id === userId) {
      return res.status(400).json({ message: "Admin cannot delete themselves" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
