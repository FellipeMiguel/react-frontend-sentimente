import React, { createContext, useState, useEffect } from "react";

// Cria o contexto de autenticação
export const AuthContext = createContext();

// Componente de Provider para o contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se o usuário está autenticado ao carregar o app
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(userLoggedIn);
  }, []);

  // Função para fazer login
  const login = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
