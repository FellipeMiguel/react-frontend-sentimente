// src/pages/CreateClass.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function CreateClass() {
  const [className, setClassName] = useState("");
  const [studentNames, setStudentNames] = useState(""); // Espera uma string separada por vírgulas
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Converte os nomes dos alunos (string) em array de objetos
    const studentsArr = studentNames
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map((name) => ({ name }));

    // Se desejar exigir ao menos um aluno, descomente a verificação abaixo:
    // if (studentsArr.length === 0) {
    //   setError("Pelo menos um aluno válido deve ser fornecido.");
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        return;
      }

      const res = await fetch(`${API_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: className, students: studentsArr }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar turma.");
      } else {
        setSuccess("Turma criada com sucesso!");
        // Opcional: redireciona para o dashboard após um tempo
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao criar turma:", error);
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <main className="flex items-center justify-center container mt-2 shadow mx-auto py-20 bg-[#E3CCAE]">
      <div className="max-w-md w-full rounded p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Criar Turma</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4 text-center">{success}</p>
        )}
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nome da Turma"
              className="w-full p-2 bg-[#F4E5D0] rounded-md outline-none"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea
              placeholder="Nome dos alunos (separados por vírgulas)"
              className="w-full p-2 bg-[#F4E5D0] rounded-md outline-none"
              value={studentNames}
              onChange={(e) => setStudentNames(e.target.value)}
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#F4E5D0] text-lg text-black font-bold py-2 rounded cursor-pointer hover:bg-[#F5DDBB]"
          >
            Criar Turma
          </button>
        </form>
      </div>
    </main>
  );
}
