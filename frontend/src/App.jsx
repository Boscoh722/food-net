// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound.jsx';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Orders from './pages/Orders';
import Complaints from './pages/Complaints';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import BuyerDashboard from './pages/Dashboard/BuyerDashboard';
import LogisticsDashboard from './pages/Dashboard/LogisticsDashboard';

// Admin
import AdminLogin from './pages/AdminLogin';
import AdminUsers from './pages/Dashboard/AdminUsers';
import AdminProducts from './pages/Dashboard/AdminProducts';
import AdminOrders from './pages/Dashboard/AdminOrders';
import AdminComplaints from './pages/Dashboard/AdminComplaints';

// Seller
import SellerProductCreate from './pages/SellerProductCreate';

// Categories
import CategoryProducts from './pages/Categories/CategoryProducts';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/products/category/:category" element={<CategoryProducts />} />

            {/* Protected Routes */}
            <Route
              path="/orders"
              element={
                <PrivateRoute roles={['buyer', 'seller', 'admin', 'logistics']}>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/complaints"
              element={
                <PrivateRoute roles={['buyer', 'seller', 'admin']}>
                  <Complaints />
                </PrivateRoute>
              }
            />

            {/* Admin Dashboard & Management Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/AdminUsers"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/AdminProducts"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminProducts />
                </PrivateRoute>
              }
            />
            <Route
              path="/AdminOrders"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/AdminComplaints"
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminComplaints />
                </PrivateRoute>
              }
            />

            {/* Seller Dashboard */}
            <Route
              path="/dashboard/seller"
              element={
                <PrivateRoute roles={['seller']}>
                  <SellerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/seller/product/new"
              element={
                <PrivateRoute roles={['seller']}>
                  <SellerProductCreate />
                </PrivateRoute>
              }
            />

            {/* Buyer Dashboard */}
            <Route
              path="/dashboard/buyer"
              element={
                <PrivateRoute roles={['buyer']}>
                  <BuyerDashboard />
                </PrivateRoute>
              }
            />

            {/* Logistics Dashboard */}
            <Route
              path="/dashboard/logistics"
              element={
                <PrivateRoute roles={['logistics']}>
                  <LogisticsDashboard />
                </PrivateRoute>
              }
            />

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;