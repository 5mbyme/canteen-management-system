import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <div className="user-info">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </div>

      <div className="orders-section">
        <h2>My Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <h3>Order #{order._id.substring(0, 8)}</h3>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
