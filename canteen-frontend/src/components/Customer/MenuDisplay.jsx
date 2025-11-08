import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MenuDisplay.css';

const MenuDisplay = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/menu';
      if (selectedCategory !== 'all') {
        url += `/category/${selectedCategory}`;
      }
      const response = await axios.get(url);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'meals', 'snacks', 'beverages', 'desserts'];

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      
      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <div className="menu-grid">
          {menuItems.map(item => (
            <div key={item._id} className="menu-card">
              <div className="menu-image">
                <img 
                  src={item.imageUrl || '/images/menu/placeholder.jpg'} 
                  alt={item.name}
                  onError={(e) => { e.target.src = '/images/menu/placeholder.jpg'; }}
                />
              </div>
              <div className="menu-details">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="menu-footer">
                  <span className="price">₹{item.price}</span>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;
