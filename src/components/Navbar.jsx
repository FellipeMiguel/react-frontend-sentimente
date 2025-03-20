// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      logout(); // Atualiza o estado global de autenticação
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <nav className="bg-[#F4E5D0] shadow py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-[#B8621B]">
          SentiMente
        </Link>

        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-black hover:text-gray-500">
              Início
            </Link>
            <Link to="/classes" className="text-black hover:text-gray-500">
              Turmas
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#E3CCAE] hover:bg-[#F5DDBB] text-black py-1 px-8 rounded cursor-pointer"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
