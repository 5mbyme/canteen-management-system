// PATH: canteen-frontend/src/components/Admin/AdminDashboard.jsx
// ACTION: REPLACE EXISTING - Complete implementation

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analytics/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <button onClick={() => setActiveTab('overview')}>Overview</button>
          <button onClick={() => setActiveTab('orders')}>Orders</button>
          <button onClick={() => setActiveTab('inventory')}>Inventory</button>
          <button onClick={() => setActiveTab('analytics')}>Analytics</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Today's Orders</h3>
              <p className="stat-value">{stats.todayOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <h3>Today's Revenue</h3>
              <p className="stat-value">₹{stats.todayRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Payments</h3>
              <p className="stat-value alert">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="dashboard-section">
          <AdminOrderManagement />
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="dashboard-section">
          <AdminInventoryManagement />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="dashboard-section">
          <AdminAnalytics />
        </div>
      )}
    </div>
  );
};

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const approvePayment = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/orders/${orderId}/approve-payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      alert('Payment approved successfully!');
    } catch (error) {
      alert('Error approving payment: ' + error.response.data.error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      alert('Order status updated!');
    } catch (error) {
      alert('Error updating order: ' + error.response.data.error);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="order-management">
      <h2>Order Management</h2>
      
      <div className="filter-buttons">
        {['Pending', 'In Progress', 'Ready', 'Delivered'].map((status) => (
          <button
            key={status}
            className={filter === status ? 'active' : ''}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>{order.orderId}</h3>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p><strong>Customer:</strong> {order.customer?.name}</p>
                <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Items:</strong> {order.items.length}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
              </div>
              <div className="order-actions">
                {order.paymentStatus === 'Pending' && (
                  <button
                    className="btn-approve"
                    onClick={() => approvePayment(order._id)}
                  >
                    Approve Payment
                  </button>
                )}
                <select
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  defaultValue={order.status}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Ready</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AdminInventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const [invRes, lowRes] = await Promise.all([
        axios.get('http://localhost:5000/api/inventory', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/inventory/low-stock', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setInventory(invRes.data);
      setLowStock(lowRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const updateStock = async (itemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/inventory/${itemId}`,
        { quantity: newQuantity, reason: 'Manual adjustment' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInventory();
      alert('Stock updated!');
    } catch (error) {
      alert('Error updating stock: ' + error.response.data.error);
    }
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="inventory-management">
      <h2>Inventory Management</h2>

      {lowStock.length > 0 && (
        <div className="low-stock-alert">
          <h3>⚠️ Low Stock Items ({lowStock.length})</h3>
          <div className="low-stock-list">
            {lowStock.map((item) => (
              <div key={item._id} className="low-stock-item">
                <span>{item.name}</span>
                <span className="stock-count">{item.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>
                  <input
                    type="number"
                    value={item.stock}
                    onChange={(e) => updateStock(item._id, parseInt(e.target.value))}
                    min="0"
                  />
                </td>
                <td>₹{item.price}</td>
                <td>
                  <span className={item.available ? 'available' : 'unavailable'}>
                    {item.available ? '✓ Available' : '✗ Unavailable'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      // Toggle availability
                      updateStock(item._id, item.stock);
                    }}
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    daily: [],
    popular: [],
    category: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const [dailyRes, popularRes, categoryRes] = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/daily-sales', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/analytics/popular-items', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/analytics/category-breakdown', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAnalytics({
        daily: dailyRes.data,
        popular: popularRes.data,
        category: categoryRes.data
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="analytics-section">
      <h2>Analytics & Reports</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Popular Items</h3>
          <ul>
            {analytics.popular.slice(0, 5).map((item) => (
              <li key={item._id}>
                <span>{item.itemName}</span>
                <span className="count">{item.totalQuantity} sold</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="analytics-card">
          <h3>Category Breakdown</h3>
          <ul>
            {analytics.category.map((cat) => (
              <li key={cat._id}>
                <span>{cat._id}</span>
                <span className="amount">₹{cat.totalSales}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="analytics-card">
          <h3>Daily Sales (Last 7 Days)</h3>
          <ul>
            {analytics.daily.slice(-7).map((day) => (
              <li key={day._id}>
                <span>{day._id}</span>
                <span className="amount">₹{day.totalSales}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;