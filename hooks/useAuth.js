"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("hopemap_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("hopemap_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("hopemap_user");
    setUser(null);
  };

  return { user, login, logout, isLoggedIn: !!user };
}