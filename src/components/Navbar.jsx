import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
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
    <nav className="bg-[#F4E5D0] text-white shadow py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Nome do App */}
        <Link to="/dashboard" className="text-2xl text-[#B8621B] font-bold">
          SentiMente
        </Link>

        {/* Exibir itens somente se estiver autenticado */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-black hover:text-gray-500">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#E3CCAE] hover:bg-[#F5DDBB] text-black py-1 px-8 rounded cursor-pointer"
            >
              Sair
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
