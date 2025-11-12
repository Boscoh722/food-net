import Order from '../models/Order.js';
import Product from '../models/Product.js';

// CREATE ORDER (buyer)
export const createOrder = async (req, res) => {
  try {
    const { product: productId, seller: sellerId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

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

// GET ALL MY ORDERS (buyer list)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('product', 'name images price unit')
      .populate('seller', 'storeName phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW: GET SINGLE ORDER BY ID (buyer detail page)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user.id,  // Only owner can view
    })
      .populate({
        path: 'product',
        select: 'name images price unit description',
        populate: { path: 'images', select: 'url alt' }
      })
      .populate('seller', 'storeName phone location coordinates')
      .populate('logistics', 'name phone vehicle');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or you do not have permission',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('getOrderById error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// UPDATE STATUS (seller or logistics)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isSeller = order.seller.toString() === req.user.id;
    const isLogistics = order.logistics?.toString() === req.user.id;

    if (!isSeller && !isLogistics) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.body.status) order.status = req.body.status;
    if (req.body.trackingInfo) order.trackingInfo = req.body.trackingInfo;

    await order.save();
    await order.populate('product seller buyer logistics');

    res.json({ success: true, order });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product buyer seller logistics')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADMIN: DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
