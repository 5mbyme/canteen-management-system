import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderTracking.css';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMyOrders();
    const interval = setInterval(fetchMyOrders, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="order-tracking">
      <h1>My Orders</h1>
      
      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order {order.orderId}</h3>
                <span className={`payment-badge ${order.paymentStatus.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="order-details">
                <p><strong>Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>

              {/* Payment Status */}
              <div className="payment-section">
                <h4>💳 Payment Status</h4>
                {order.paymentStatus === 'Pending' && (
                  <p className="status-text pending">⏳ Waiting for admin approval...</p>
                )}
                {order.paymentStatus === 'Approved' && (
                  <p className="status-text approved">✅ Payment approved!</p>
                )}
                {order.paymentStatus === 'Rejected' && (
                  <p className="status-text rejected">❌ Payment rejected</p>
                )}
              </div>

              {/* Table Allocation */}
              <div className="table-section">
                <h4>🪑 Table Information</h4>
                {order.tableNumber ? (
                  <div className="table-info">
                    <p className="table-number">Table {order.tableNumber}</p>
                    <p className="table-status">Your table is ready!</p>
                  </div>
                ) : (
                  <p className="status-text pending">⏳ Table will be assigned after payment approval</p>
                )}
              </div>

              {/* Order Items */}
              <div className="items-section">
                <h4>🍲 Items</h4>
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.menuItem.name} x {item.quantity} - ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order Timeline */}
              <div className="timeline">
                <div className={`timeline-item ${order.paymentStatus === 'Approved' ? 'active' : ''}`}>
                  <span>✅ Order Placed</span>
                </div>
                <div className={`timeline-item ${order.paymentStatus === 'Approved' ? 'active' : ''}`}>
                  <span>💳 Payment Approved</span>
                </div>
                <div className={`timeline-item ${order.status === 'In Progress' ? 'active' : ''}`}>
                  <span>👨‍🍳 Cooking</span>
                </div>
                <div className={`timeline-item ${order.status === 'Ready' ? 'active' : ''}`}>
                  <span>🍽️ Ready</span>
                </div>
                <div className={`timeline-item ${order.status === 'Delivered' ? 'active' : ''}`}>
                  <span>🎉 Delivered</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
