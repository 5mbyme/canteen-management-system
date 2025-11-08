import axios from 'axios';

export const setBaseURL = () => {
  axios.defaults.baseURL = 'http://localhost:5000';
};

export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};
