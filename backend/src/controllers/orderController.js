import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { product: productId, seller: sellerId } = req.body;
    
    // Verify product exists and get seller from product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Use seller from product if sellerId not provided or doesn't match
    const finalSellerId = sellerId || product.seller;
    
    const order = new Order({ 
      product: productId,
      seller: finalSellerId,
      buyer: req.user.id 
    });
    await order.save();
    await order.populate('product seller', 'name price location');
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

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product buyer seller logistics');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
