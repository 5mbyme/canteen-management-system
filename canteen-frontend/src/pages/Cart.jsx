import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, clearCart } from '../redux/cart/cart.actions';
import { getCartTotal } from '../redux/cart/cart.utils';
import axios from 'axios';

const Cart = ({ user }) => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = getCartTotal(cartItems);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        food: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total,
      paymentMethod: 'online',
      roomNumber: user.role === 'teacher' ? user.roomNumber : null
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { 'x-auth-token': token }
      });
      alert('Order placed successfully!');
      dispatch(clearCart());
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'Order placement failed');
    }
  };

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')}>Browse Menu</button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.imageUrl || '/default-food.jpg'} alt={item.name} />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
                <div className="cart-item-quantity">
                  <span>{item.quantity}</span>
                </div>
                <div className="cart-item-total">
                  ₹{item.price * item.quantity}
                </div>
                <button onClick={() => dispatch(removeFromCart(item))}>Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
            <button onClick={() => dispatch(clearCart())} className="clear-btn">
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
