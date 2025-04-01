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

// Função auxiliar para formatar a data de YYYY-MM-DD para DD/MM/YYYY
const formatDate = (dateStr) => {
  const parts = dateStr.split("-");
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export default function ClassAnalytics() {
  const { classId: paramClassId } = useParams();
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [votes, setVotes] = useState({});
  const [students, setStudents] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [classId, setClassId] = useState(paramClassId || null);
  const [className, setClassName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Se classId veio pela URL, usamos ele; senão, buscamos a primeira turma
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
    } else {
      fetch(`${API_URL}/classes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setClassId(data[0]._id);
            setClassName(data[0].name);
            setStudents(data[0].students || []);
          }
        })
        .catch((err) => console.error("Erro ao buscar turmas:", err));
    }
  }, [classId]);

  useEffect(() => {
    // Buscar datas para a turma específica
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
          setDates(data);
        })
        .catch((err) => console.error("Erro ao buscar datas:", err));
    }
  }, [classId]);

  useEffect(() => {
    // Ao selecionar uma data, busca os votos daquela data no backend
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
        .then((data) => {
          setVotes(data.votes);
        })
        .catch((err) => console.error("Erro ao buscar votos:", err));
    }
  }, [selectedDate, classId]);

  const addDate = async () => {
    if (newDate && !dates.some((d) => d.date === newDate)) {
      try {
        const res = await fetch(`${API_URL}/dates`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ date: newDate, classId }),
        });
        if (res.ok) {
          const result = await res.json();
          setDates(
            [...dates, result.newDate].sort((a, b) =>
              a.date.localeCompare(b.date)
            )
          );
          setNewDate("");
        }
      } catch (error) {
        console.error("Erro ao adicionar data:", error);
      }
    }
  };

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
          if (selectedDate && selectedDate._id === id) {
            setSelectedDate(null);
          }
        }
      } catch (error) {
        console.error("Erro ao excluir data:", error);
      }
    }
  };

  const selectDate = (dateObj) => {
    setSelectedDate(
      selectedDate && selectedDate._id === dateObj._id ? null : dateObj
    );
  };

  // Redireciona para /emotion-selection/:classId/:studentId
  const selectStudent = (student) => {
    navigate(`/emotion-selection/${classId}/${student._id}`);
  };

  return (
    <main className="container mx-auto mt-2 shadow p-4 rounded-b-sm">
      {/* Título com o nome da turma */}
      <h1 className="text-3xl font-bold text-center mb-4">{className}</h1>
      <div className="flex items-center">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="mr-2 p-2 border text-[#262A56] rounded"
        />
        <button
          onClick={addDate}
          className="bg-[#F4E5D0] text-black py-2 px-8 rounded cursor-pointer"
        >
          Adicionar Data
        </button>
      </div>
      <div className="mt-4">
        {dates.map((dateObj) => (
          <div key={dateObj._id}>
            <div className="flex items-center gap-2">
              <button
                className="mt-2 text-black py-2 px-4 rounded cursor-pointer flex items-center"
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
                className="mt-2 text-[#B8621B] hover:underline cursor-pointer"
              >
                Excluir
              </button>
            </div>
            {selectedDate && selectedDate._id === dateObj._id && (
              <div
                className="mt-2 transition-all duration-300 ease-in-out"
                style={{ overflow: "hidden" }}
              >
                {/* Lista de Alunos */}
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
                {/* Barra de Progresso das Emoções */}
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
                          ></div>
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
    </main>
  );
}
