// src/utils/token.js

// ✅ Just handle storing/retrieving token in localStorage
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");


