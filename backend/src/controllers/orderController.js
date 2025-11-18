import Order from '../models/Order.js';
import Product from '../models/Product.js';

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

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.user.id,
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

export const getMyAssignedOrders = async (req, res) => {
  try {
    const logisticsUserId = req.user.id;

    const orders = await Order.find({ 
      logistics: logisticsUserId 
    })
      .populate('product', 'name images price unit')
      .populate('seller', 'storeName phone')
      .populate('buyer', 'name phone')
      .sort({ createdAt: -1 });
      
    res.status(200).json({
      success: true,
      orders: orders,
    });

  } catch (err) {
    console.error('getMyAssignedOrders error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching assigned orders.' 
    });
  }
};

export const getLogisticsOrders = async (req, res) => {
  try {
    const logisticsId = req.user.id;
    
    const orders = await Order.find({ 
      logisticsProvider: logisticsId 
    })
    .populate('user', 'name email phone')
    .populate('items.product', 'name category unit images')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (err) {
    console.error('Get logistics orders error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logistics orders'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;
    const logisticsId = req.user.id;

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.logisticsProvider.toString() !== logisticsId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    
    order.statusHistory.push({
      status: status,
      updatedBy: logisticsId,
      timestamp: new Date()
    });

    await order.save();
    
    await order.populate('user', 'name email phone');
    await order.populate('items.product', 'name category unit images');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

export const updateOrder = async (req, res) => {
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
    console.error('updateOrder error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

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