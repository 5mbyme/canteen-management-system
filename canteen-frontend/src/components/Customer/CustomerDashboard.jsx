import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const [notiRes, countRes] = await Promise.all([
        axios.get('http://localhost:5000/api/notifications?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/notifications/unread/count', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setNotifications(notiRes.data.notifications || []);
      setUnreadCount(countRes.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <div className="notification-bell">
          <button onClick={() => setActiveTab('notifications')}>
            🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          My Orders
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      {activeTab === 'orders' && <OrderHistory />}
      {activeTab === 'profile' && <CustomerProfile />}
      {activeTab === 'notifications' && <NotificationCenter onRefresh={fetchNotifications} />}
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [filter, page]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const status = filter === 'all' ? '' : `&status=${filter}`;
      const response = await axios.get(
        `http://localhost:5000/api/orders/my-orders?page=${page}&limit=10${status}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:5000/api/orders/${orderId}/cancel`,
          { reason: 'Customer cancellation' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Order cancelled successfully');
        fetchOrders();
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  if (loading) return <div className="loading">Loading your orders...</div>;

  return (
    <div className="order-history">
      <h2>Order History</h2>

      <div className="filters">
        {['all', 'Pending', 'In Progress', 'Ready', 'Delivered'].map((status) => (
          <button
            key={status}
            className={filter === status ? 'active' : ''}
            onClick={() => {
              setFilter(status);
              setPage(1);
            }}
          >
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found. Start ordering now!</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <h3>{order.orderId}</h3>
                <span className={`badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Items:</strong> {order.items.length}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
              </div>

              <div className="order-items">
                <h4>Items Ordered:</h4>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.menuItem?.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-actions">
                {order.status === 'Pending' && (
                  <button
                    className="btn-cancel"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
                <button className="btn-track">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomerProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/user', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  return (
    <div className="customer-profile">
      <h2>My Profile</h2>

      <div className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            disabled={!editing}
          />
        </div>

        <div className="form-actions">
          {!editing ? (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="btn-primary" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = ({ onRefresh }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications?limit=20', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchNotifications();
      onRefresh();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
      onRefresh();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) return <div className="loading">Loading notifications...</div>;

  return (
    <div className="notification-center">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h4>{notif.title}</h4>
                <p>{notif.message}</p>
                <small>
                  {new Date(notif.createdAt).toLocaleString()}
                </small>
              </div>

              <div className="notification-actions">
                {!notif.isRead && (
                  <button
                    className="btn-mark-read"
                    onClick={() => markAsRead(notif._id)}
                  >
                    ✓
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => deleteNotification(notif._id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;