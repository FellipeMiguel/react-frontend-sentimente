import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";
import happyImg from "../assets/emotion/happy.svg";
import sadImg from "../assets/emotion/sad.svg";
import angryImg from "../assets/emotion/angry.svg";
import calmImg from "../assets/emotion/calm.svg";
import tiredImg from "../assets/emotion/tired.svg";
import gratefulImg from "../assets/emotion/grateful.svg";
import anxiousImg from "../assets/emotion/anxious.svg";
import lovedImg from "../assets/emotion/loved.svg";
import confusedImg from "../assets/emotion/confused.svg";
import thoughtfulImg from "../assets/emotion/thoughtful.svg";
import excitedImg from "../assets/emotion/excited.svg";
import frustratedImg from "../assets/emotion/frustrated.svg";
import sensitiveImg from "../assets/emotion/sensitive.svg";
import confidentImg from "../assets/emotion/confident.svg";
import stressedImg from "../assets/emotion/stressed.svg";
import accomplishedImg from "../assets/emotion/accomplished.svg";
import { FaArrowAltCircleDown, FaArrowAltCircleRight } from "react-icons/fa";

const fixedEmotions = [
  { label: "Feliz", image: happyImg },
  { label: "Triste", image: sadImg },
  { label: "Irritado", image: angryImg },
  { label: "Calmo", image: calmImg },
  { label: "Cansado", image: tiredImg },
  { label: "Grato", image: gratefulImg },
  { label: "Ansioso", image: anxiousImg },
  { label: "Amado", image: lovedImg },
  { label: "Confuso", image: confusedImg },
  { label: "Pensativo", image: thoughtfulImg },
  { label: "Empolgado", image: excitedImg },
  { label: "Frustrado", image: frustratedImg },
  { label: "Sensível", image: sensitiveImg },
  { label: "Confiante", image: confidentImg },
  { label: "Estressado", image: stressedImg },
  { label: "Realizado", image: accomplishedImg },
];

// Formata YYYY-MM-DD para DD/MM/YYYY
const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function ClassAnalytics() {
  const { classId: paramClassId } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [classId, setClassId] = useState(paramClassId || null);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [votes, setVotes] = useState({});
  const navigate = useNavigate();

  // Busca a turma e alunos
  useEffect(() => {
    if (classId) {
      fetch(`${API_URL}/classes/${classId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setClassName(data.name);
          setStudents(data.students || []);
        })
        .catch((err) => console.error("Erro ao buscar turma:", err));
    }
  }, [classId]);

  // Busca datas para a turma específica (ordenadas da mais nova para a mais antiga)
  useEffect(() => {
    if (classId) {
      fetch(`${API_URL}/dates?classId=${classId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.sort((a, b) => b.date.localeCompare(a.date));
          setDates(sorted);
          // Abre a última data adicionada automaticamente
          setSelectedDate(sorted[0] || null);
        })
        .catch((err) => console.error("Erro ao buscar datas:", err));
    }
  }, [classId]);

  // Busca votos para a data selecionada
  useEffect(() => {
    if (selectedDate && classId) {
      fetch(
        `${API_URL}/emotions?date=${selectedDate.date}&classId=${classId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setVotes(data.votes || {}))
        .catch((err) => console.error("Erro ao buscar votos:", err));
    }
  }, [selectedDate, classId]);

  // Adiciona a data atual (sem input)
  const addDate = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!dates.some((d) => d.date === today)) {
      try {
        const res = await fetch(`${API_URL}/dates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ date: today, classId }),
        });
        if (res.ok) {
          const result = await res.json();
          const updated = [result.newDate, ...dates];
          setDates(updated);
          // Seleciona a data recém-adicionada
          setSelectedDate(result.newDate);
        }
      } catch (error) {
        console.error("Erro ao adicionar data:", error);
      }
    }
  };

  // Exclui data com confirmação
  const deleteDate = async (id) => {
    if (window.confirm("Deseja realmente excluir essa data?")) {
      try {
        const res = await fetch(`${API_URL}/dates/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          setDates(dates.filter((d) => d._id !== id));
          if (selectedDate && selectedDate._id === id) setSelectedDate(null);
        }
      } catch (error) {
        console.error("Erro ao excluir data:", error);
      }
    }
  };

  // Alterna seleção de data
  const selectDate = (dateObj) => {
    setSelectedDate((prev) =>
      prev && prev._id === dateObj._id ? null : dateObj
    );
  };

  // Redireciona para seleção de emoção
  const selectStudent = (student) => {
    navigate(`/emotion-selection/${classId}/${student._id}`);
  };

  return (
    <main className="container mx-auto mt-2 shadow p-4 rounded-b-sm">
      <h1 className="text-3xl font-bold text-center mb-4">{className}</h1>
      <div className="flex items-center mb-4 gap-4">
        <button
          onClick={addDate}
          className="bg-[#F4E5D0] text-black py-2 px-8 rounded cursor-pointer"
        >
          Adicionar Data
        </button>
        <button
          onClick={() => navigate(`/class-students/${classId}`)}
          className="bg-[#262A56] text-white py-2 px-6 rounded cursor-pointer hover:bg-[#1f2548]"
        >
          Ver Alunos
        </button>
      </div>
      {dates.length === 0 ? (
        <p className="text-center text-black text-lg">
          Crie uma data para iniciar a seleção de sentimentos
        </p>
      ) : (
        <div className="space-y-4">
          {dates.map((dateObj) => (
            <div key={dateObj._id}>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center text-black py-2 px-4 rounded cursor-pointer"
                  onClick={() => selectDate(dateObj)}
                >
                  {formatDate(dateObj.date)}
                  <span className="ml-2">
                    {selectedDate && selectedDate._id === dateObj._id ? (
                      <FaArrowAltCircleDown />
                    ) : (
                      <FaArrowAltCircleRight />
                    )}
                  </span>
                </button>
                <button
                  onClick={() => deleteDate(dateObj._id)}
                  className="text-[#B8621B] hover:underline cursor-pointer"
                >
                  Excluir
                </button>
              </div>
              {selectedDate && selectedDate._id === dateObj._id && (
                <div className="mt-2 transition-all duration-300 ease-in-out overflow-hidden">
                  <div className="flex gap-4 flex-wrap">
                    {students.map((student, i) => (
                      <div key={i} className="p-2 bg-[#F4E5D0] rounded-sm">
                        <p
                          className="cursor-pointer"
                          onClick={() => selectStudent(student)}
                        >
                          {student.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-6 mt-4">
                    {fixedEmotions.map(({ label, image }) => {
                      const voteCount = votes[label] || 0;
                      const totalStudents = students.length;
                      const percentage = totalStudents
                        ? (voteCount / totalStudents) * 100
                        : 0;
                      return (
                        <div key={label} className="text-center">
                          <img
                            src={image}
                            alt={label}
                            className="mx-auto w-12 h-12"
                          />
                          <div className="relative h-4 w-full bg-[#F4E5D0] mt-2 rounded-md">
                            <div
                              className="h-full bg-[#262A56] rounded-md"
                              style={{ width: `${percentage}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#B8621B]">
                              {voteCount}/{totalStudents}
                            </span>
                          </div>
                          <p>{label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
