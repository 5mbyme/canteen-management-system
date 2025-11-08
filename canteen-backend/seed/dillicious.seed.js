// run with: node seed/dillicious.seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const items = [
  // VEG STARTERS (snacks)
  { name: 'Dahi ke Kebabs', description: 'Veg starter', price: 160, category: 'snacks', stock: 50, available: true },
  { name: 'Paneer Kurkure', description: 'Crispy paneer sticks', price: 170, category: 'snacks', stock: 50, available: true },
  { name: 'Paneer Tikka', description: 'Tandoor paneer', price: 180, category: 'snacks', stock: 50, available: true },
  { name: 'Paneer Malai Tikka', description: 'Creamy paneer tikka', price: 200, category: 'snacks', stock: 50, available: true },
  { name: 'Paneer Achari Tikka', description: 'Pickled spice paneer', price: 190, category: 'snacks', stock: 50, available: true },
  { name: 'Tandoori Chaap', description: 'Soy chaap (half/full)', price: 175, category: 'snacks', stock: 50, available: true },
  { name: 'Achari Chaap', description: 'Pickled chaap (half/full)', price: 180, category: 'snacks', stock: 50, available: true },
  { name: 'Afghani Chaap', description: 'Creamy chaap (half/full)', price: 210, category: 'snacks', stock: 50, available: true },

  // CHINESE (snacks)
  { name: 'Chilli Potato', description: 'Half/Full', price: 85, category: 'snacks', stock: 100, available: true },
  { name: 'Honey Chilli Potato', description: 'Half/Full', price: 100, category: 'snacks', stock: 100, available: true },
  { name: 'Chilli Paneer', description: 'Half/Full', price: 150, category: 'snacks', stock: 100, available: true },
  { name: 'Hakka Noodles', description: 'Half/Full', price: 119, category: 'snacks', stock: 100, available: true },
  { name: 'Veg Noodles', description: 'Half/Full', price: 99, category: 'snacks', stock: 100, available: true },
  { name: 'Garlic Noodles', description: 'Half/Full', price: 119, category: 'snacks', stock: 100, available: true },
  { name: 'Paneer Noodles', description: 'Half/Full', price: 135, category: 'snacks', stock: 100, available: true },
  { name: 'Singapuri Noodles', description: 'Half/Full', price: 135, category: 'snacks', stock: 100, available: true },
  { name: 'Chicken Noodles', description: 'Half/Full', price: 150, category: 'snacks', stock: 100, available: true },

  // MAGGI (snacks)
  { name: 'Maggi Punjabi Tadka', description: 'Masala tadka maggi', price: 85, category: 'snacks', stock: 60, available: true },
  { name: 'Korean Maggi', description: 'K-style maggi', price: 85, category: 'snacks', stock: 60, available: true },
  { name: 'Chilli Garlic Maggi', description: 'Spicy garlic maggi', price: 85, category: 'snacks', stock: 60, available: true },

  // NON VEG STARTERS (snacks)
  { name: 'Tandoori Murg', description: 'Half/Full', price: 430, category: 'snacks', stock: 40, available: true },
  { name: 'Afghani Murg', description: 'Half/Full', price: 480, category: 'snacks', stock: 40, available: true },
  { name: 'Malai Tikka', description: 'Half/Full', price: 480, category: 'snacks', stock: 40, available: true },
  { name: 'Chicken Tangdi (2)', description: '2 pieces', price: 130, category: 'snacks', stock: 80, available: true },
  { name: 'Seekh Kebab (2)', description: '2 pieces', price: 100, category: 'snacks', stock: 80, available: true },
  { name: 'Chicken 65 (6 pcs)', description: 'Spicy fried chicken', price: 120, category: 'snacks', stock: 80, available: true },
  { name: 'Chicken Fry (6 pcs)', description: 'Fried chicken', price: 120, category: 'snacks', stock: 80, available: true },
  { name: 'Afghani Tikka', description: 'Half/Full', price: 480, category: 'snacks', stock: 40, available: true },

  // VEG CURRIES (meals)
  { name: 'Dal Tadka', description: 'Half/Full', price: 130, category: 'meals', stock: 100, available: true },
  { name: 'Dal Makhni', description: 'Half/Full', price: 150, category: 'meals', stock: 100, available: true },
  { name: 'Punjabi Dal Tadka', description: 'Half/Full', price: 140, category: 'meals', stock: 100, available: true },
  { name: 'Mix Veg', description: 'Half/Full', price: 150, category: 'meals', stock: 100, available: true },
  { name: 'Jeera Aloo', description: 'Half/Full', price: 130, category: 'meals', stock: 100, available: true },
  { name: 'Matar Paneer', description: 'Half/Full', price: 170, category: 'meals', stock: 100, available: true },
  { name: 'Shahi Paneer', description: 'Half/Full', price: 180, category: 'meals', stock: 100, available: true },
  { name: 'Kadhai Paneer', description: 'Half/Full', price: 180, category: 'meals', stock: 100, available: true },
  { name: 'Paneer Butter Masala', description: 'Half/Full', price: 180, category: 'meals', stock: 100, available: true },
  { name: 'Paneer-do-Pyaza', description: 'Half/Full', price: 180, category: 'meals', stock: 100, available: true },
  { name: 'Paneer Lababdaar', description: 'Half/Full', price: 190, category: 'meals', stock: 100, available: true },
  { name: 'Paneer Hyderabadi', description: 'Half/Full', price: 190, category: 'meals', stock: 100, available: true },
  { name: 'Masala Chaap', description: 'Half/Full', price: 170, category: 'meals', stock: 100, available: true },
  { name: 'Tawa Chaap', description: 'Half/Full', price: 170, category: 'meals', stock: 100, available: true },
  { name: 'Aachari Chaap', description: 'Half/Full', price: 170, category: 'meals', stock: 100, available: true },
  { name: 'Keema Chaap', description: 'Half/Full', price: 170, category: 'meals', stock: 100, available: true },
  { name: 'Kadhai Chaap', description: 'Half/Full', price: 170, category: 'meals', stock: 100, available: true },

  // NON-VEG CURRIES (meals)
  { name: 'Chicken Korma', description: 'Qtr/Half/Full', price: 265, category: 'meals', stock: 80, available: true },
  { name: 'Dhaba Chicken Curry', description: 'Qtr/Half/Full', price: 265, category: 'meals', stock: 80, available: true },
  { name: 'Butter Chicken', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },
  { name: 'Chicken Changezi', description: 'Qtr/Half/Full', price: 265, category: 'meals', stock: 80, available: true },
  { name: 'Handi Murg', description: 'Half/Full', price: 320, category: 'meals', stock: 80, available: true },
  { name: 'Tawa Chicken', description: 'Half/Full', price: 320, category: 'meals', stock: 80, available: true },
  { name: 'Murg Tikka Masala', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },
  { name: 'Chicken Keema', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },
  { name: 'Lemon Chicken', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },
  { name: 'Chicken Rara', description: 'Qtr/Half/Full', price: 340, category: 'meals', stock: 80, available: true },
  { name: 'Chicken-do-Pyaza', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },
  { name: 'Kadhai Chicken', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },
  { name: 'Seekh Kebab Gravy', description: 'Qtr/Half/Full', price: 285, category: 'meals', stock: 80, available: true },

  // EGG CURRIES (meals)
  { name: 'Dhabha Style Anda Curry', description: 'Half/Full', price: 150, category: 'meals', stock: 80, available: true },
  { name: 'Egg Mughlai', description: 'Half/Full', price: 180, category: 'meals', stock: 80, available: true },
  { name: 'Kadhai Anda Curry', description: 'Half/Full', price: 150, category: 'meals', stock: 80, available: true },
  { name: 'Egg Changezi', description: 'Half/Full', price: 150, category: 'meals', stock: 80, available: true },
  { name: 'Egg Bhurji', description: 'Half/Full', price: 140, category: 'meals', stock: 80, available: true },
  { name: 'Egg-do-Pyaza', description: 'Half/Full', price: 150, category: 'meals', stock: 80, available: true },

  // BREADS & RICE (meals)
  { name: 'Tandoori Roti', description: 'Bread', price: 8, category: 'meals', stock: 200, available: true },
  { name: 'Butter Roti', description: 'Bread', price: 10, category: 'meals', stock: 200, available: true },
  { name: 'Naan', description: 'Bread', price: 25, category: 'meals', stock: 200, available: true },
  { name: 'Butter Naan', description: 'Bread', price: 30, category: 'meals', stock: 200, available: true },
  { name: 'Chur-Chur Naan', description: 'Bread', price: 60, category: 'meals', stock: 200, available: true },
  { name: 'Aloo/Pyaz/Mix Naan', description: 'Stuffed naan', price: 40, category: 'meals', stock: 200, available: true },
  { name: 'Garlic Naan', description: 'Bread', price: 50, category: 'meals', stock: 200, available: true },
  { name: 'Chilli Naan', description: 'Bread', price: 50, category: 'meals', stock: 200, available: true },
  { name: 'Paneer Naan', description: 'Bread', price: 50, category: 'meals', stock: 200, available: true },
  { name: 'Paneer Paratha', description: 'Paratha', price: 50, category: 'meals', stock: 200, available: true },
  { name: 'Aloo/Pyaz Paratha', description: 'Paratha', price: 40, category: 'meals', stock: 200, available: true },

  { name: 'Dal Chawal', description: 'Rice plate', price: 65, category: 'meals', stock: 120, available: true },
  { name: 'Dal Makhni Chawal', description: 'Rice plate', price: 70, category: 'meals', stock: 120, available: true },
  { name: 'Rajma Chawal', description: 'Rice plate', price: 70, category: 'meals', stock: 120, available: true },
  { name: 'Dhaba Chicken Rice', description: 'Rice with chicken', price: 120, category: 'meals', stock: 120, available: true },
  { name: 'Plain Rice', description: 'Steamed rice', price: 50, category: 'meals', stock: 120, available: true },
  { name: 'Jeera Rice', description: 'Cumin rice', price: 60, category: 'meals', stock: 120, available: true },

  // BIRYANI (meals)
  { name: 'Hyderabadi Chicken Dum Biryani', description: 'Full/Half/Qtr', price: 220, category: 'meals', stock: 80, available: true },
  { name: 'Veg Biryani', description: 'Full/Half', price: 190, category: 'meals', stock: 80, available: true },

  // FRIED RICE (meals)
  { name: 'Veg Fried Rice', description: 'Veg fried rice', price: 75, category: 'meals', stock: 100, available: true },
  { name: 'Chilli Garlic Fried Rice', description: 'Spicy garlic rice', price: 85, category: 'meals', stock: 100, available: true },
  { name: 'Schezwan Fried Rice', description: 'Spicy schezwan rice', price: 85, category: 'meals', stock: 100, available: true },
  { name: 'Lemon Fried Rice', description: 'Citrus fried rice', price: 85, category: 'meals', stock: 100, available: true },
  { name: 'Paneer Fried Rice', description: 'Paneer fried rice', price: 90, category: 'meals', stock: 100, available: true },
  { name: 'Egg Fried Rice', description: 'Egg fried rice', price: 80, category: 'meals', stock: 100, available: true },
  { name: 'Chicken Fried Rice', description: 'Chicken fried rice', price: 120, category: 'meals', stock: 100, available: true },
  { name: 'Fish Fried Rice', description: 'Fish fried rice', price: 130, category: 'meals', stock: 100, available: true },

  // PLATTERS (snacks)
  { name: 'Veg Regular Platter', description: 'Veg Momos + Fried Rice + Veg Noodles + Chilli Potato', price: 135, category: 'snacks', stock: 40, available: true },
  { name: 'Veg Special Platter', description: 'Paneer Momos + Schezwan Rice + Chilli Garlic Noodles + Chilli Paneer + Veg Manchurian', price: 175, category: 'snacks', stock: 40, available: true },
  { name: 'Non-Veg Regular Platter', description: 'Chicken Momos + Egg Fried Rice + Chicken Noodles + Chilli Chicken', price: 190, category: 'snacks', stock: 40, available: true },
  { name: 'Non-Veg Special Platter', description: 'Chicken Momos + Chicken Fried Rice + Chicken Noodles + Chilli Chicken + Butter Garlic Fish', price: 230, category: 'snacks', stock: 40, available: true },

  // MANCHURIAN (snacks)
  { name: 'Veg Manchurian', description: 'Half/Full', price: 140, category: 'snacks', stock: 80, available: true },

  // FRIES & ROLLS (snacks)
  { name: 'French Fries', description: 'Half/Full', price: 85, category: 'snacks', stock: 120, available: true },
  { name: 'Cheesy French Fries', description: 'Half/Full', price: 100, category: 'snacks', stock: 120, available: true },
  { name: 'Spring Roll', description: 'Half/Full', price: 100, category: 'snacks', stock: 120, available: true },

  // MOMOS (snacks)
  { name: 'Veg Delight Momos', description: 'Steamed/Tandoori/Pan/Gravy', price: 65, category: 'snacks', stock: 120, available: true },
  { name: 'Paneer Momos', description: 'Steamed/Tandoori/Pan/Gravy', price: 75, category: 'snacks', stock: 120, available: true },
  { name: 'Chicken Momos', description: 'Steamed/Tandoori/Pan/Gravy', price: 90, category: 'snacks', stock: 120, available: true },

  // THALIS (meals)
  { name: 'Regular Veg Thali', description: 'Dal Tadka, PBM, Raita, Rice, 2 Butter Roti, Salad, Chutney', price: 135, category: 'meals', stock: 60, available: true },
  { name: 'Deluxe Veg Thali', description: 'Dal Makhni, Kadhai Paneer, Raita, Jeera Rice, Butter Naan, Salad, Chutney', price: 150, category: 'meals', stock: 60, available: true },
  { name: 'Stuffed Naan Thali', description: 'Dal Makhni + Kadhai Paneer/PBM + Raita/Mix Veg + Stuffed Naan + Salad + Chutney', price: 165, category: 'meals', stock: 60, available: true },
  { name: 'Chur-Chur Naan Thali', description: 'Dal Makhni + Kadhai Paneer/PBM + Raita/Mix Veg + CC Naan + Salad + Chutney', price: 180, category: 'meals', stock: 60, available: true },
  { name: 'Chawal Thali', description: 'Dal Tadka, Rajma, Raita, Jeera Rice, Salad, Chutney', price: 115, category: 'meals', stock: 60, available: true },

  // NON-VEG THALIS (meals)
  { name: 'Butter Chicken Thali', description: '2 pc chicken + 2 butter roti + biryani + salad + chutney', price: 170, category: 'meals', stock: 60, available: true },
  { name: 'Handi Chicken Thali', description: '2 pc chicken + 2 butter roti + salad + chutney', price: 175, category: 'meals', stock: 60, available: true },
  { name: 'Changezi Chicken Thali', description: '2 pc chicken + 2 butter roti + salad + chutney', price: 170, category: 'meals', stock: 60, available: true },
  { name: 'Chicken Korma Thali', description: '2 pc chicken + 2 butter roti + salad + chutney', price: 170, category: 'meals', stock: 60, available: true },
  { name: 'Kadhai Chicken Thali', description: '2 pc chicken + 2 butter roti + salad + chutney', price: 170, category: 'meals', stock: 60, available: true },
  { name: 'Dhaba Chicken Curry Thali', description: '2 pc chicken + 2 butter roti + salad + chutney', price: 165, category: 'meals', stock: 60, available: true },
  { name: 'Dillicious Non-Veg Thali', description: '2 pc curry of your choice + dal makhni + stuffed naan + jeera rice + salad + chutney', price: 190, category: 'meals', stock: 60, available: true },
  { name: 'Chicken-Egg Syndrome', description: '2 pc curry + kadhai anda curry + stuffed naan + jeera rice + salad + chutney', price: 215, category: 'meals', stock: 60, available: true },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canteen-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
    
    await MenuItem.deleteMany({});
    console.log('✅ Old menu cleared');
    
    // Add slug to every item automatically:
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace spaces and special with -
    .replace(/^-+|-+$/g, '');     // trim -
}
const itemsWithSlugs = items.map(item => ({
  ...item,
  slug: slugify(item.name),
}));
await MenuItem.insertMany(itemsWithSlugs);

    console.log(`✅ New menu inserted: ${items.length} items`);
    
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  }
})();
