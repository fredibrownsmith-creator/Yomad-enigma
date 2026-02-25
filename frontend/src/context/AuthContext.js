import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, removeToken } from '../utils/storage';
import { loginUser, registerUser, fetchProfile } from '../api/auth';
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading]  = useState(true);
  useEffect(() => { loadUser(); }, []);
  const loadUser = async () => {
    try {
      const stored = await getToken();
      if (stored) {
        setTokenState(stored);
        const profile = await fetchProfile(stored);
        setUser(profile);
      }
    } catch {
      await removeToken();
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    await setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
  };
  const register = async (userData) => {
    const data = await registerUser(userData);
    await setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
  };
  const logout = async () => {
    await removeToken();
    setTokenState(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
