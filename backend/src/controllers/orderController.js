import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, buyer: req.user.id });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate('product seller logistics');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.seller.toString() !== req.user.id && order.logistics?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    order.status = req.body.status;
    order.trackingInfo = req.body.trackingInfo;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
