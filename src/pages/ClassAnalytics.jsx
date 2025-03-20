// src/pages/ClassAnalytics.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function ClassAnalytics() {
  const { classId } = useParams(); // Rota: /class-analytics/:classId
  const navigate = useNavigate();

  // Estados para gerenciar data, alunos, gráfico e erros
  const [selectedDate, setSelectedDate] = useState("");
  const [dateSet, setDateSet] = useState(false);
  const [students, setStudents] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");

  // Função para confirmar a data selecionada manualmente
  const handleConfirmDate = () => {
    if (selectedDate) {
      setDateSet(true);
      fetchStudents(); // Carrega os alunos assim que a data é confirmada
    } else {
      setError("Selecione uma data válida.");
    }
  };

  // Busca os alunos da turma a partir da rota GET /api/classes/:classId
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/classes/${classId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        // Presumindo que o endpoint retorna um objeto com a chave "students"
        setStudents(data.students || []);
      } else {
        setError("Falha ao buscar alunos.");
      }
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      setError("Erro ao conectar ao servidor.");
    }
  };

  // Função para buscar os dados agregados de emoções para a data selecionada
  const fetchChartData = async () => {
    if (!selectedDate) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_URL}/emotions/${classId}?date=${selectedDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setChartData(data);
      } else {
        setError("Falha ao buscar os dados do gráfico.");
      }
    } catch (err) {
      console.error("Erro ao buscar dados do gráfico:", err);
      setError("Erro ao conectar ao servidor.");
    }
  };

  // Polling: sempre que a data estiver definida, buscar os dados do gráfico a cada 5 segundos
  useEffect(() => {
    if (dateSet && selectedDate) {
      // Busca imediatamente
      fetchChartData();
      const intervalId = setInterval(() => {
        fetchChartData();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [selectedDate, dateSet]);

  // Calcula o total de votos no gráfico (para calcular porcentagens)
  const totalCount = chartData.reduce((acc, item) => acc + item.count, 0);

  return (
    <main className="container mx-auto mt-2 bg-[#E3CCAE] p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Análise da Turma</h1>

      <div className="flex flex-col md:flex-row bg-white shadow rounded p-4">
        {/* Coluna Esquerda: Seleção da Data */}
        <div className="md:w-1/4 flex flex-col items-center md:items-start border-r pr-4 mb-4 md:mb-0">
          <label className="block font-semibold mb-2">
            Selecione uma Data:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleConfirmDate}
            className="mt-4 bg-[#F4E5D0] text-lg text-black font-bold py-2 px-4 rounded cursor-pointer hover:bg-[#F5DDBB]"
          >
            Confirmar Data
          </button>
        </div>

        {/* Coluna Direita: Lista de Alunos e Gráfico */}
        <div className="md:w-3/4 flex flex-col">
          {dateSet ? (
            <>
              <p className="mb-4 text-center">
                Data selecionada: {new Date(selectedDate).toLocaleDateString()}
              </p>

              {/* Renderização do gráfico */}
              {chartData.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold mb-2 text-center">
                    Resultado para {new Date(selectedDate).toLocaleDateString()}
                  </h2>
                  <div className="flex justify-around items-end">
                    {chartData.map((item, index) => {
                      const percentage = totalCount
                        ? (item.count / totalCount) * 100
                        : 0;
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <span className="mb-1 text-sm font-medium">
                            {Math.round(percentage)}%
                          </span>
                          <div
                            className="w-10 bg-blue-500 rounded-t"
                            style={{ height: `${Math.min(percentage, 100)}px` }}
                          ></div>
                          <span className="mt-1 text-sm">{item.emotion}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lista de alunos: ao clicar, redireciona para a página de seleção de emoções */}
              <div className="w-full max-w-md mt-6 bg-white rounded shadow p-4">
                <h2 className="text-xl font-bold mb-2 text-center">Alunos</h2>
                {students.length === 0 ? (
                  <p className="text-center">Nenhum aluno encontrado.</p>
                ) : (
                  <ul>
                    {students.map((student) => (
                      <li
                        key={student._id}
                        className="flex justify-between items-center border-b py-2"
                      >
                        <span className="text-lg">{student.name}</span>
                        <button
                          onClick={() =>
                            navigate(
                              `/emotion-selection/${classId}/${student._id}?date=${selectedDate}`
                            )
                          }
                          className="bg-[#F4E5D0] text-black py-1 px-4 rounded cursor-pointer hover:bg-[#F5DDBB]"
                        >
                          Selecionar Emoção
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : (
            <p className="text-center">
              Selecione uma data para visualizar alunos e gráfico.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
