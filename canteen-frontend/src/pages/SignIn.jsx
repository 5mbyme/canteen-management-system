import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res && res.data && res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setAuth(res.data.user);
      navigate('/');
    } else {
      alert('Login failed: No token returned');
    }
  } catch (err) {
    const msg =
      err?.response?.data?.msg ||
      err?.response?.data?.errors?.[0]?.msg ||
      err?.message ||
      'Login failed';
    alert(msg);
    console.error('Login error:', err);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign in to continue</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
