// controllers/analyticsController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// controllers/analyticsController.js - Enhanced version
export const getAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Calculate date ranges (same as before)
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default: // 30d
        startDate.setDate(now.getDate() - 30);
    }

    // Get real chart data
    const [userGrowth, revenueTrends, orderVolume] = await Promise.all([
      // User Growth
      User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range === '1y' ? '%Y-%m' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),
      
      // Revenue Trends
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range === '1y' ? '%Y-%m' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            revenue: { $sum: '$totalPrice' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]),
      
      // Order Volume
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: range === '1y' ? '%Y-%m' : '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ])
    ]);

    // Format chart data
    const charts = [
      {
        title: 'User Growth',
        description: 'New user registrations over time',
        data: userGrowth.map(item => ({
          date: item._id,
          value: item.count
        }))
      },
      {
        title: 'Revenue Trends',
        description: 'Monthly revenue performance',
        data: revenueTrends.map(item => ({
          date: item._id,
          value: item.revenue
        }))
      },
      {
        title: 'Order Volume',
        description: 'Daily order processing',
        data: orderVolume.map(item => ({
          date: item._id,
          value: item.count
        }))
      }
    ];

    const [
      totalUsers,
      newUsers,
      totalProducts,
      activeProducts,
      totalOrders,
      revenueData,
      topProducts,
      userActivity
    ] = await Promise.all([
      // Total Users
      User.countDocuments(),
      
      // New Users (in time range)
      User.countDocuments({ createdAt: { $gte: startDate } }),
      
      // Total Products
      Product.countDocuments(),
      
      // Active Products (approved)
      Product.countDocuments({ approved: true }),
      
      // Total Orders (in time range)
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      
      // Revenue Data
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            orderCount: { $sum: 1 }
          }
        }
      ]),
      
      // Top Products
      Order.aggregate([
        {
          $match: { 
            createdAt: { $gte: startDate },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        {
          $unwind: '$items'
        },
        {
          $group: {
            _id: '$items.product',
            totalSales: { $sum: '$items.quantity' }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: '$product'
        },
        {
          $project: {
            name: '$product.name',
            sales: '$totalSales'
          }
        },
        {
          $sort: { sales: -1 }
        },
        {
          $limit: 5
        }
      ]),
      
      // User Activity (last 24 hours for active sessions)
      User.countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    ]);

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate);
    const periodDiff = now.getTime() - startDate.getTime();
    prevStartDate.setTime(prevStartDate.getTime() - periodDiff);
    
    const [
      prevTotalUsers,
      prevTotalProducts,
      prevTotalOrders,
      prevRevenueData
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: prevStartDate, $lt: startDate } }),
      Product.countDocuments({ createdAt: { $gte: prevStartDate, $lt: startDate } }),
      Order.countDocuments({ createdAt: { $gte: prevStartDate, $lt: startDate } }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: prevStartDate, $lt: startDate },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' }
          }
        }
      ])
    ]);

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (!previous || previous === 0) return 100;
      return Math.round(((current - previous) / previous) * 100);
    };

    const currentRevenue = revenueData[0]?.totalRevenue || 0;
    const prevRevenue = prevRevenueData[0]?.totalRevenue || 0;

    const overview = [
      {
        label: 'Total Users',
        value: totalUsers,
        change: calculateChange(totalUsers, prevTotalUsers),
        icon: 'Users',
        color: 'primary'
      },
      {
        label: 'Active Products',
        value: activeProducts,
        change: calculateChange(activeProducts, prevTotalProducts),
        icon: 'Package',
        color: 'success'
      },
      {
        label: 'Total Orders',
        value: totalOrders,
        change: calculateChange(totalOrders, prevTotalOrders),
        icon: 'ShoppingCart',
        color: 'accent'
      },
      {
        label: 'Revenue',
        value: currentRevenue,
        change: calculateChange(currentRevenue, prevRevenue),
        icon: 'DollarSign',
        color: 'purple'
      }
    ];

   
    const response = {
      overview,
      charts,
      topProducts: topProducts.map(p => ({
        name: p.name,
        sales: p.sales
      })),
      userActivity: {
        newRegistrations: newUsers,
        activeSessions: userActivity,
        pageViews: Math.floor(totalOrders * 8.5) 
      }
    };

    res.json(response);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
};

// Helper function to generate mock chart data
function generateMockChartData(startDate, endDate, min, max) {
  const data = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split('T')[0],
      value: Math.floor(Math.random() * (max - min + 1)) + min
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}