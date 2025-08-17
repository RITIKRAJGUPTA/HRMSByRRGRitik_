// src/context/AuthProvider.js
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getToken, setToken, clearToken } from "../utils/token";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // restore session on mount (without expiry checks)
    const token = getToken();
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setUser(data.user))
        .catch(() => handleLogout());
    }
  }, []);

  const handleLogin = (data) => {
    setToken(data.token);
    setUser(data.user);
    toast.success("Welcome back 👋");
    navigate("/");
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    navigate("/login");
  };

  const ctx = useMemo(() => ({ user, handleLogin, handleLogout }), [user]);

  return (
    <AuthContext.Provider value={ctx}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
      />
    </AuthContext.Provider>
  );
}
