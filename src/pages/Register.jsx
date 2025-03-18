// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Novo estado para confirmação
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validação de senha e confirmação
    if (password !== confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.", err.message);
    }
  };

  return (
    <main className="flex items-center justify-center container mt-2 shadow mx-auto py-30">
      <div className="max-w-md w-full py-6 rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Crie sua Conta</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              id="name"
              type="text"
              className="w-full mt-1 p-2 bg-[#F4E5D0] rounded-md outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="nome"
            />
          </div>
          <div>
            <input
              id="email"
              type="email"
              className="w-full mt-1 p-2 bg-[#F4E5D0] rounded-md outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email"
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              className="w-full mt-1 p-2 bg-[#F4E5D0] rounded-md outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="senha"
            />
          </div>
          <div>
            <input
              id="confirm-password"
              type="password"
              className="w-full mt-1 p-2 bg-[#F4E5D0] rounded-md outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="confirme sua senha"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F4E5D0] text-lg text-black font-bold py-2 rounded cursor-pointer hover:bg-[#F5DDBB]"
          >
            Registrar
          </button>
          <div className="text-left">
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:underline"
            >
              Já tem conta? Entrar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
