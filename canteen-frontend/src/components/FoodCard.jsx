import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cart/cart.actions';

const FoodCard = ({ food }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(food));
  };

  // Prefer explicit imageUrl if present, else build from slug, else default
  const imgSrc =
    food.imageUrl ||
    (food.slug ? `/images/menu/${food.slug}.jpg` : '/default-food.jpg');

  return (
    <div className="food-card">
      <img src={imgSrc} alt={food.name} />
      <div className="food-card-content">
        <h3>{food.name}</h3>
        <p className="description">{food.description}</p>
        <p className="category">{food.category}</p>
        <div className="food-card-footer">
          <span className="price">₹{food.price}</span>
          <button
            onClick={handleAddToCart}
            className="add-to-cart-btn"
            disabled={!food.available || food.stock === 0}
          >
            {food.available && food.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
