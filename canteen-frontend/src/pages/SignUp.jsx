import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    contactNumber: '',
    roomNumber: ''
  });

  const { name, email, password, confirmPassword, role, contactNumber, roomNumber } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const onSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) return alert('Passwords do not match');

  try {
    const res = await axios.post('/api/auth/register', {
      name, email, password, role, contactNumber,
      roomNumber: role === 'teacher' ? roomNumber : null
    });
    if (res && res.data) {
      alert('Registration successful! Please sign in.');
      navigate('/signin');
    } else {
      alert('Unexpected response from server');
    }
  } catch (err) {
    const msg =
      err?.response?.data?.msg ||
      err?.response?.data?.errors?.[0]?.msg ||
      err?.message ||
      'Registration failed';
    alert(msg);
    console.error('Register error:', err);
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
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
              minLength="6"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={role} onChange={onChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={contactNumber}
              onChange={onChange}
              required
            />
          </div>
          {role === 'teacher' && (
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={roomNumber}
                onChange={onChange}
              />
            </div>
          )}
          <button type="submit" className="submit-btn">Sign Up</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
