import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
  setError(null);
  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    setToken(data.token);
    setUser(data.user);
    return true;      // ← IMPORTANTE
  } catch (err) {
    setError(err.message);
    return false;     // ← IMPORTANTE
  }
};


  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const fetchAuth = async (url, options = {}) => {
    if (!token) throw new Error("Sesión no iniciada");

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthPage = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <h2>Debe iniciar sesión para ver esta página</h2>;
  return children;
};