import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint({ message: req.body.message, user: req.user.id });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name role');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    complaint.status = req.body.status;
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
