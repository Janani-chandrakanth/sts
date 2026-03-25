import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // { token, role, ...decoded info }
  const [loading, setLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    const restore = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const role  = await AsyncStorage.getItem('role');
        const name  = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        if (token && role) {
          setUser({ token, role, name, email });
        }
      } catch (e) {
        console.warn('Failed to restore session:', e);
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (token, role, name = '', email = '') => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('role', role);
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userEmail', email);
    setUser({ token, role, name, email });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'role', 'userName', 'userEmail']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
