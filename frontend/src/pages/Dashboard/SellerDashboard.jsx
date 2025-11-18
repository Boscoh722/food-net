import { useState, useEffect } from 'react';
import { 
  DollarSign, Package, PlusCircle, Clock,
  Leaf, AlertTriangle, CheckCircle2, MapPin, 
  ShoppingBag, RefreshCw, Truck, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const SellerStatCard = ({ title, value, icon: Icon, valueColor = 'text-green-600', description, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-blue-300"
    >
      <div className="text-center">
        <Icon className={`w-12 h-12 ${valueColor} mx-auto mb-4`} />
        <h3 className="font-medium text-gray-700 text-sm">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        <p className={`mt-3 text-3xl font-bold ${valueColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
};

function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    approvedProducts: 0,
    pendingApproval: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    revenue: 0
  });
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsRes = await api.get('/seller/products');
      const myProducts = productsRes.data?.products || [];
      setProducts(myProducts);

      let ordersArray = [];
      try {
        const ordersRes = await api.get('/seller/orders');
        ordersArray = ordersRes.data?.orders || [];
        setRecentOrders(ordersArray.slice(0, 5));
      } catch (orderErr) {
        console.warn('Could not load orders:', orderErr);
      }

      const approvedProducts = myProducts.filter(p => p.approved === true).length;
      const pendingApproval = myProducts.filter(p => p.approved !== true).length;

      const pendingOrders = ordersArray.filter(o => o.status === 'pending').length;
      const confirmedOrders = ordersArray.filter(o => o.status === 'confirmed').length;
      const shippedOrders = ordersArray.filter(o => o.status === 'shipped').length;
      const deliveredOrders = ordersArray.filter(o => o.status === 'delivered').length;

      const totalRevenue = ordersArray
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalProducts: myProducts.length,
        approvedProducts,
        pendingApproval,
        totalOrders: ordersArray.length,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        revenue: totalRevenue
      });

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `KSh ${price?.toLocaleString() || 0}`;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Seller Dashboard
                </h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Seller'}!</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/seller/product/new')}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Product
            </button>

            <button
              onClick={loadDashboard}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading && 'animate-spin'}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Product Overview</h2>
            <p className="text-gray-600 mt-2">Manage your product catalog and approvals</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <SellerStatCard title="Total Products" value={stats.totalProducts} icon={Package} valueColor="text-blue-600" description="All products" onClick={() => navigate('/seller/products')} />
            <SellerStatCard title="Approved" value={stats.approvedProducts} icon={CheckCircle2} valueColor="text-green-600" description="Ready for sale" onClick={() => navigate('/seller/products?approved=true')} />
            <SellerStatCard title="Pending" value={stats.pendingApproval} icon={Clock} valueColor="text-yellow-600" description="Awaiting review" onClick={() => navigate('/seller/products?approved=false')} />
            <SellerStatCard title="Revenue" value={formatPrice(stats.revenue)} icon={DollarSign} valueColor="text-green-600" description="Total earnings" />
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Overview</h2>
            <p className="text-gray-600 mt-2">Track order fulfillment</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <SellerStatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} valueColor="text-blue-600" onClick={() => navigate('/seller/orders')} />
            <SellerStatCard title="Pending" value={stats.pendingOrders} icon={Clock} valueColor="text-yellow-600" onClick={() => navigate('/seller/orders?status=pending')} />
            <SellerStatCard title="Confirmed" value={stats.confirmedOrders} icon={CheckCircle2} valueColor="text-blue-600" onClick={() => navigate('/seller/orders?status=confirmed')} />
            <SellerStatCard title="Shipped" value={stats.shippedOrders} icon={Truck} valueColor="text-purple-600" onClick={() => navigate('/seller/orders?status=shipped')} />
            <SellerStatCard title="Delivered" value={stats.deliveredOrders} icon={CheckCircle2} valueColor="text-green-600" onClick={() => navigate('/seller/orders?status=delivered')} />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Products</h2>
            <button onClick={() => navigate('/seller/products')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </button>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-700">No products yet – add your first one!</p>
              <button onClick={() => navigate('/seller/product/new')} className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => {
                const productImage = product.images?.[0]?.url || product.images?.[0];

                return (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/seller/products/${product._id}`)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 transition duration-200 cursor-pointer overflow-hidden hover:shadow-md"
                  >
                    <div className="h-48 bg-gray-100 relative">
                      {productImage ? (
                        <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl text-gray-400">📦</div>
                      )}
                      {product.approved === false && (
                        <span className="absolute top-2 left-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">Pending</span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                      <p className="text-xl font-bold text-green-600 mt-2">{formatPrice(product.price)}</p>
                      <div className="flex justify-between text-sm text-gray-500 mt-3">
                        <span>{product.category?.name || 'Uncategorized'}</span>
                        {product.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{product.location}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <button onClick={() => navigate('/seller/orders')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-xl text-gray-700">No orders yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map(order => (
                      <tr 
                        key={order._id}
                        onClick={() => navigate(`/seller/orders/${order._id}`)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">{order.orderNumber}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;