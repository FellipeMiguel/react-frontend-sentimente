// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch para carregar os dados do usuário
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/login"); // Redireciona para login se não estiver autenticado
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Erro ao buscar o usuário:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full bg-white shadow-md rounded p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Bem-vindo{user ? `, ${user.name}` : ""}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {user && `ID do usuário: ${user.id}`}
        </p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
        >
          Sair
        </button>
      </div>
    </main>
  );
}
