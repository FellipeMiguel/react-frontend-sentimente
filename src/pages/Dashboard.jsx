import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import teacherImg from "../assets/teacher.svg";
import studentImg from "../assets/students.svg";

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

  return (
    <main className="flex justify-center mt-2 bg-[#E3CCAE]">
      <div className="container w-full bg-[#E3CCAE] shadow-md rounded p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Bem-vindo ao <span className="text-[#B8621B]">SentiMente</span>
          {user ? `, ${user.name}` : ""}
        </h1>
        <p className="font-semibold">Selecione</p>
        <div className="flex items-center justify-around mt-20 flex-wrap gap-8">
          <div>
            <img
              src={teacherImg}
              alt="Imagem de um professor segurando um livro"
              className="mb-6"
            />
            <button className="bg-[#F4E5D0] hover:bg-[#F5DDBB] text-black py-1 px-8 rounded cursor-pointer">
              Acessar turmas
            </button>
          </div>
          <div>
            <img src={studentImg} alt="Imagem de alunos pulando" />
            <button className="bg-[#F4E5D0] hover:bg-[#F5DDBB] text-black py-1 px-8 rounded cursor-pointer">
              Criar turmas
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
