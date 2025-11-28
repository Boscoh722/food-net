import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, logisticsProvider, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    let sellerId = null;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // Ensure all items belong to the same seller (as per Order model limitation)
      if (sellerId && sellerId.toString() !== product.seller.toString()) {
        return res.status(400).json({ message: 'All items in an order must be from the same seller' });
      }
      sellerId = product.seller;

      // Check stock
      if (product.quantityInStock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: subtotal,
        productName: product.name,
        productImage: product.images?.[0]?.url || ''
      });
    }

    const order = new Order({
      buyer: req.user.id,
      seller: sellerId,
      items: orderItems,
      total: totalAmount,
      shippingAddress,
      paymentMethod,
      logistics: logisticsProvider || null
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantityInStock: -item.quantity, orderCount: 1 }
      });
    }

    await order.populate('items.product seller logistics');

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Create order error:', err);
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
      .populate('items.product', 'name images price unit')
      .populate('seller', 'storeName phone')
      .populate('buyer', 'name phone')
      .populate('logistics', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
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
      .populate('items.product', 'name images price unit description')
      .populate('seller', 'storeName phone location coordinates')
      .populate('buyer', 'name phone email')
      .populate('logistics', 'name phone vehicle');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.error('Get order by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ logistics: req.user.id })
      .populate('items.product', 'name images price unit')
      .populate('seller', 'storeName phone location')
      .populate('buyer', 'name phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error('Get assigned orders error:', err);
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

    // Initialize statusHistory if it doesn't exist (though it should be in schema)
    if (!order.statusHistory) order.statusHistory = [];

    order.statusHistory.push({
      status: status,
      updatedBy: req.user.id,
      timestamp: new Date()
    });

    await order.save();
    await order.populate('items.product seller buyer logistics');

    res.json({ success: true, order });
  } catch (err) {
    console.error('Update order status error:', err);
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
    await order.populate('items.product seller buyer logistics');

    res.json({ success: true, order });
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name images price')
      .populate('buyer', 'name email')
      .populate('seller', 'storeName')
      .populate('logistics', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get all orders error:', err);
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
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};