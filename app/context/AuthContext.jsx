// app/context/AuthContext.jsx
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Load token from storage on startup
  useEffect(() => {
    const savedToken = localStorage.getItem("gmail_token");
    if (savedToken) setToken(savedToken);
  }, []);

  const login = () => {
    if (!window.google) return;
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/gmail.readonly",
      callback: (res) => {
        if (res?.access_token) {
          setToken(res.access_token);
          localStorage.setItem("gmail_token", res.access_token); // Save session
        }
      },
    });
    client.requestAccessToken();
  };

  const logout = () => {
    if (token && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(token);
    }
    setToken(null);
    localStorage.removeItem("gmail_token"); // Clear session
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);