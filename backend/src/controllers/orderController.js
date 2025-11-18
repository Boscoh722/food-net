import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { product: productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = new Order({ 
      product: productId,
      seller: product.seller,
      buyer: req.user.id 
    });
    
    await order.save();
    await order.populate('product seller', 'name price location storeName');
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'buyer') {
      filter.buyer = req.user.id;
    } else if (req.user.role === 'seller') {
      filter.seller = req.user.id;
    } else if (req.user.role === 'logistics') {
      filter.logistics = req.user.id;
    }

    const orders = await Order.find(filter)
      .populate('product', 'name images price unit')
      .populate('seller', 'storeName phone')
      .populate('buyer', 'name phone')
      .populate('logistics', 'name phone')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'buyer') {
      filter.buyer = req.user.id;
    } else if (req.user.role === 'seller') {
      filter.seller = req.user.id;
    } else if (req.user.role === 'logistics') {
      filter.logistics = req.user.id;
    }

    const order = await Order.findOne(filter)
      .populate('product', 'name images price unit description')
      .populate('seller', 'storeName phone location coordinates')
      .populate('buyer', 'name phone email')
      .populate('logistics', 'name phone vehicle');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ logistics: req.user.id })
      .populate('product', 'name images price unit')
      .populate('seller', 'storeName phone location')
      .populate('buyer', 'name phone')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      logistics: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    
    order.statusHistory.push({
      status: status,
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await order.save();
    await order.populate('product seller buyer logistics');

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

export const updateOrder = async (req, res) => {
  try {
    let filter = { _id: req.params.id };
    
    if (req.user.role === 'seller') {
      filter.seller = req.user.id;
    } else if (req.user.role === 'logistics') {
      filter.logistics = req.user.id;
    }

    const order = await Order.findOne(filter);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.body.status) order.status = req.body.status;
    if (req.body.trackingInfo) order.trackingInfo = req.body.trackingInfo;
    if (req.body.logistics) order.logistics = req.body.logistics;

    await order.save();
    await order.populate('product seller buyer logistics');

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'name images price')
      .populate('buyer', 'name email')
      .populate('seller', 'storeName')
      .populate('logistics', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

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