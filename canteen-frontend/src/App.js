import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      axios.defaults.headers.common['x-auth-token'] = token;
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const setAuth = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar isAuthenticated={isAuthenticated} logout={logout} />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/signin" 
                element={isAuthenticated ? <Navigate to="/" /> : <SignIn setAuth={setAuth} />} 
              />
              <Route 
                path="/signup" 
                element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} 
              />
              <Route 
                path="/cart" 
                element={isAuthenticated ? <Cart user={user} /> : <Navigate to="/signin" />} 
              />
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/signin" />} 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
