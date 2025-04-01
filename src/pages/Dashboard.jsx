import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import teacherImg from "../assets/teacher.svg";
import studentImg from "../assets/students.svg";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Se a resposta não for ok, redireciona para a tela de login
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Erro ao buscar o usuário:", error);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-[#E3CCAE]">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-[#E3CCAE]">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex justify-center mt-2 bg-[#E3CCAE]">
      <div className="container w-full bg-[#E3CCAE] shadow-md rounded p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Bem-vindo ao <span className="text-[#B8621B]">SentiMente</span>,{" "}
          {user.name}
        </h1>
        <p className="font-semibold">Selecione</p>
        <div className="flex items-center justify-around mt-20 flex-wrap gap-8">
          <div>
            <img
              src={teacherImg}
              alt="Imagem de um professor segurando um livro"
              className="mb-6"
            />
            <button
              onClick={() => navigate("/classes")}
              className="bg-[#F4E5D0] hover:bg-[#F5DDBB] text-black py-1 px-8 rounded cursor-pointer"
            >
              Acessar turmas
            </button>
          </div>
          <div>
            <img
              src={studentImg}
              alt="Imagem de alunos pulando"
              className="mb-6"
            />
            <button
              onClick={() => navigate("/create-class")}
              className="bg-[#F4E5D0] hover:bg-[#F5DDBB] text-black py-1 px-8 rounded cursor-pointer"
            >
              Criar turmas
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
