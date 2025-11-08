import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/food');
      setFoods(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const filteredFoods = filter === 'all' 
    ? foods 
    : foods.filter(food => food.category === filter);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Tiwari's Canteen</h1>
        <p>Chase the flavours</p>
      </div>

      <div className="filter-section">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          All
        </button>
        <button onClick={() => setFilter('meals')} className={filter === 'meals' ? 'active' : ''}>
          Meals
        </button>
        <button onClick={() => setFilter('snacks')} className={filter === 'snacks' ? 'active' : ''}>
          Snacks
        </button>
        <button onClick={() => setFilter('beverages')} className={filter === 'beverages' ? 'active' : ''}>
          Beverages
        </button>
      </div>

      <div className="food-grid">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredFoods.map(food => (
            <FoodCard key={food._id} food={food} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
