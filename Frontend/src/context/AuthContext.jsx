// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false); // ✅ tells app when hydration is done

  // 🔁 Hydrate from localStorage on first load / refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setToken(storedToken);
        console.log("AuthContext: restored from localStorage", parsed);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error("AuthContext: error reading localStorage", err);
      setUser(null);
      setToken(null);
    } finally {
      setAuthReady(true); // ✅ very important for PrivateRoute
    }
  }, []);

 const login = (userData, tokenValue) => {
  setUser(userData);
  setToken(tokenValue);

  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("token", tokenValue);
  localStorage.setItem("userId", userData.id); // ✅ REQUIRED

  setAuthReady(true);
};

const logout = () => {
  setUser(null);
  setToken(null);

  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("userId"); // ✅
};

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, authReady, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
