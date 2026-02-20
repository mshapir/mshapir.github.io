import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEMO_USER = {
  id: 1,
  name: 'Demo User',
  email: 'demo@accessflow.com',
  password: 'Demo1234!',
  createdAt: '2024-01-01T00:00:00.000Z',
  orders: [],
};

const seedDemoUser = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (!users.find(u => u.email === DEMO_USER.email)) {
    users.push(DEMO_USER);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Seed demo user and load current session on mount
  useEffect(() => {
    seedDemoUser();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      orders: [],
    };
    
    // Save to users list
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    const userToStore = { ...newUser };
    delete userToStore.password; // Don't store password in current user
    localStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    
    return userToStore;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const userToStore = { ...user };
    delete userToStore.password;
    localStorage.setItem('user', JSON.stringify(userToStore));
    setUser(userToStore);
    
    return userToStore;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    }
    
    throw new Error('User not found');
  };

  const deleteAccount = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    localStorage.removeItem('user');
    setUser(null);
  };

  const addOrder = (order) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      if (!users[userIndex].orders) {
        users[userIndex].orders = [];
      }
      users[userIndex].orders.push({
        id: Date.now(),
        ...order,
        date: new Date().toISOString(),
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...users[userIndex] };
      delete updatedUser.password;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    addOrder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
