import React, {createContext, useState, useContext} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        'http://192.168.8.137:5000/auth/login',
        {username, password},
      );
      if (response.status === 200) {
        const newToken = response.data.access_token;
        setIsAuthenticated(true);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const signup = async (username, password) => {
    try {
      const response = await axios.post(
        'http://192.168.8.137:5000/auth/signup',
        {username, password},
      );
      if (response.status === 201) {
        const newToken = response.data.access_token;
        setIsAuthenticated(true);
        setToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, token, login, signup, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
