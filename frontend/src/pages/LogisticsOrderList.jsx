// src/pages/LogisticsOrderList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Truck, Package, ArrowLeft, Filter, Loader, AlertTriangle, Search } from 'lucide-react';
import api from '../lib/api';

// Reusable component logic for the list items (similar to DeliveryItem)
const OrderListItem = ({ order, onClick }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'confirmed':
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr 
      onClick={onClick}
      className="bg-white border-b hover:bg-gray-50 cursor-pointer transition duration-150"
    >
      <td className="px-6 py-4 font-semibold text-gray-900">{order.orderNumber}</td>
      <td className="px-6 py-4 text-gray-700">{order.shippingAddress}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
          {order.status.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-gray-900">KSh {order.total?.toLocaleString()}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
};

const LogisticsOrderList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const filterStatus = searchParams.get('status');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersRes = await api.get('/orders/logistics/my-orders');
      const orders = ordersRes.data?.orders || [];
      setAllOrders(orders);
      setError(null);
    } catch (err) {
      console.error('Error fetching assigned orders:', err);
      setError('Failed to load assigned orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (filterStatus && allOrders.length > 0) {
      const statusList = filterStatus === 'pending' ? ['pending', 'confirmed'] : [filterStatus];
      const filtered = allOrders.filter(order => statusList.includes(order.status));
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(allOrders);
    }
  }, [allOrders, filterStatus]);

  const handleFilterChange = (status) => {
    if (status) {
        navigate(`/logistics/orders?status=${status}`);
    } else {
        navigate('/logistics/orders');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
  }

  const statuses = [
    { label: 'All', status: '' },
    { label: 'Pending Pickup', status: 'pending' },
    { label: 'In Transit', status: 'shipped' },
    { label: 'Delivered', status: 'delivered' },
    { label: 'Cancelled', status: 'cancelled' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <button 
        onClick={() => navigate('/dashboard/logistics')} 
        className="flex items-center text-green-600 hover:text-green-700 transition mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Truck className="w-7 h-7 text-green-600" />
        Assigned Deliveries ({filteredOrders.length})
      </h1>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            {statuses.map(s => (
                <button
                    key={s.label}
                    onClick={() => handleFilterChange(s.status)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
                        filterStatus === s.status || (!filterStatus && s.status === '')
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {s.label}
                </button>
            ))}
        </div>
        <div className="relative mt-4 md:mt-0 w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Search by Order # or Address..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
      
      {/* Order Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <AlertTriangle className='w-8 h-8 mb-3 text-yellow-500' />
                <p className='font-semibold'>No orders found {filterStatus ? `with status: ${filterStatus.toUpperCase()}` : ''}.</p>
                {filterStatus && <button onClick={() => handleFilterChange('')} className='mt-2 text-green-600 hover:text-green-700'>View All</button>}
            </div>
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map(order => (
                <OrderListItem 
                  key={order._id} 
                  order={order} 
                  onClick={() => navigate(`/logistics/orders/${order._id}`)} 
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LogisticsOrderList;
