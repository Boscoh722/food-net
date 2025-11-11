// controllers/orderController.js
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { body, param, validationResult } from 'express-validator';

// VALIDATIONS (match model)
export const createOrderValidations = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item required'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity min 1'),
  body('shippingAddress').trim().notEmpty().withMessage('Shipping address required'),
  body('paymentMethod').isIn(['mpesa', 'card', 'cash', 'wallet']).withMessage('Invalid payment method'),
];

export const updateOrderStatusValidations = [
  param('id').isMongoId().withMessage('Invalid order ID'),
  body('status')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid status'),
  body('trackingNumber').optional().trim(),
];

// CREATE ORDER (buyer)
export const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const buyerId = req.user.id;

    // Validate & prepare items
    const preparedItems = [];
    let total = 0;
    let sellerId = null;

    for (const item of items) {
      const product = await Product.findById(item.product).session(session).populate('images', 'url');
      if (!product) throw new Error(`Product ${item.product} not found`);
      if (product.quantityInStock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

      if (!sellerId) {
        sellerId = product.seller;
      } else if (sellerId.toString() !== product.seller.toString()) {
        throw new Error('All items in an order must belong to the same seller');
      }

      const primaryImage = product.images?.[0]?.url || '';
      const subtotal = item.quantity * product.price;
      preparedItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
        productName: product.name,
        productImage: primaryImage,
      });

      total += subtotal;

      // Reduce stock
      await product.reduceStock(item.quantity);
    }

    const order = new Order({
      buyer: buyerId,
      seller: sellerId,
      items: preparedItems,
      total,
      shippingAddress,
      paymentMethod,
    });

    await order.save({ session });
    await session.commitTransaction();

    await order.populate('buyer seller items.product', 'name email phone');

    res.status(201).json({ success: true, order });
  } catch (err) {
    await session.abortTransaction();
    console.error('Create order:', err);
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

// UPDATE STATUS (seller/logistics/admin)
export const updateOrderStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status, trackingNumber } = req.body;
    const userRole = req.user.role;
    const isSeller = order.seller.toString() === req.user.id;
    const isLogistics = order.logistics?.toString() === req.user.id;
    const isAdmin = userRole === 'admin';

    // Role-based status transitions
    if (status === 'confirmed' && !isSeller && !isAdmin) return res.status(403).json({ message: 'Seller/admin only' });
    if (status === 'shipped' && !isLogistics && !isAdmin) return res.status(403).json({ message: 'Logistics/admin only' });
    if (status === 'delivered' && !isLogistics && !isAdmin) return res.status(403).json({ message: 'Logistics/admin only' });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    await order.populate('buyer seller logistics items.product', 'name email phone');

    res.json({ success: true, order });
  } catch (err) {
    console.error('Update order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// CANCEL ORDER (buyer/seller/admin)
export const cancelOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isBuyer = order.buyer.toString() === req.user.id;
    const isSeller = order.seller.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isBuyer && !isSeller && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    await order.cancel(req.user.id, req.body.reason || '');

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantityInStock += item.quantity;
        product.inStock = product.quantityInStock > 0;
        await product.save();
      }
    }

    res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    console.error('Cancel order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET MY ORDERS (buyer)
export const getMyOrders = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { buyer: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('seller logistics items.product', 'name email phone url category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get my orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET SELLER ORDERS (seller)
export const getSellerOrders = async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ message: 'Seller only' });

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { seller: req.user.id };
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('buyer logistics items.product', 'name email phone url category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get seller orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL ORDERS (admin)
export const getAllOrders = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.buyer) filter.buyer = req.query.buyer;
    if (req.query.seller) filter.seller = req.query.seller;

    const orders = await Order.find(filter)
      .populate('buyer seller logistics items.product', 'name email phone url category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get all orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE ORDER (admin only)
export const deleteOrder = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantityInStock += item.quantity;
        product.inStock = product.quantityInStock > 0;
        await product.save();
      }
    }

    await order.deleteOne();
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error('Delete order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// GET LOGISTICS ORDERS (logistics users)
export const getLogisticsOrders = async (req, res) => {
  try {
    // Ensure only logistics role can access
    if (req.user.role !== 'logistics') {
      return res.status(403).json({ message: 'Access denied: logistics only' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = {};

    // Logistics users can filter by order status or assigned location
    if (req.query.status) filter.status = req.query.status;
    if (req.user.location) filter.deliveryLocation = req.user.location;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const orders = await Order.find(filter)
      .populate('buyer', 'name phone location')
      .populate('seller', 'name phone location')
      .populate('items.product', 'name price unit')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get logistics orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ORDER BY ID (buyer/seller/logistics/admin)
export const getOrderById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone location')
      .populate('seller', 'name email phone location')
      .populate('logistics', 'name email phone location')
      .populate('items.product', 'name price unit images');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const userId = req.user.id;
    const role = req.user.role;
    const isBuyer = order.buyer?._id?.toString() === userId;
    const isSeller = order.seller?._id?.toString() === userId;
    const isLogistics = order.logistics?._id?.toString() === userId;

    if (!isBuyer && !isSeller && !isLogistics && role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Get order by id:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

