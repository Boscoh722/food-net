import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -idNumber');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.role !== 'seller') return res.status(400).json({ message: 'Not a seller' });
    user.approved = true;
    await user.save();
    res.json({ message: 'Seller approved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
