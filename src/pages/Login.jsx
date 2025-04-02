import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        localStorage.setItem("token", data.token);
        login();
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.", err.message);
    }
  };

  return (
    <main className="flex items-center justify-center container mt-2 shadow mx-auto py-30">
      <div className="max-w-md w-full py-6 rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Entre no Sistema
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4 px-4">
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
          <button
            type="submit"
            className="w-full bg-[#F4E5D0] text-lg text-black font-bold py-2 rounded cursor-pointer hover:bg-[#F5DDBB]"
          >
            Entrar
          </button>
          <div className="text-left">
            <Link
              to="/register"
              className="text-sm text-indigo-600 hover:underline"
            >
              Criar usuário
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
