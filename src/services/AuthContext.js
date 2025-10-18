import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@elearning_auth_state';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role, avatar }
  const [isGuest, setIsGuest] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = !!user?.role && user.role === 'admin';

  // Restore persisted auth state
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const obj = JSON.parse(raw);
          if (obj?.user) setUser(obj.user);
          else if (obj?.isGuest) setIsGuest(true);
        }
      } catch {}
      finally {
        setInitializing(false);
      }
    })();
  }, []);

  const persist = useCallback(async (value) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {}
  }, []);

  const login = useCallback(async (u) => {
    setUser(u);
    setIsGuest(false);
    await persist({ user: u });
  }, [persist]);

  const register = useCallback(async (u) => {
    // same as login for local mock
    setUser(u);
    setIsGuest(false);
    await persist({ user: u });
  }, [persist]);

  const continueAsGuest = useCallback(async () => {
    setUser(null);
    setIsGuest(true);
    await persist({ isGuest: true });
  }, [persist]);

  const logout = useCallback(async () => {
    setUser(null);
    setIsGuest(false);
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const value = useMemo(() => ({
    initializing,
    user,
    isAuthenticated,
    isGuest,
    isAdmin,
    login,
    register,
    continueAsGuest,
    logout,
  }), [initializing, user, isAuthenticated, isGuest, isAdmin, login, register, continueAsGuest, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
