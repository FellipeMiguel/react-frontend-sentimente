// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Verifica se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(userLoggedIn);
  }, []);

  // Função de logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("isAuthenticated");
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <nav className="bg-[#F4E5D0] text-white shadow py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Nome do App */}
        <Link to="/" className="text-xl text-[#B8621B] font-bold">
          SentiMente
        </Link>

        {/* Exibir itens somente se estiver autenticado */}
        {isAuthenticated ? (
          <div className="flex space-x-4">
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Sair
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
