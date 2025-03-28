import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function ClassAnalytics() {
  // Agora 'dates' é um array de objetos com _id e date
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [votes, setVotes] = useState({});
  const [students, setStudents] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [classId, setClassId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar turma e alunos do professor
    fetch(`${API_URL}/classes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Supondo que o endpoint retorne um array de classes
        if (Array.isArray(data) && data.length > 0) {
          setClassId(data[0]._id);
          setStudents(data[0].students || []);
        }
      })
      .catch((err) => console.error("Erro ao buscar alunos:", err));

    // Buscar datas salvas do professor no backend
    fetch(`${API_URL}/dates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // O endpoint retorna um array de registros: { _id, teacher, date }
        setDates(data);
      })
      .catch((err) => console.error("Erro ao buscar datas:", err));
  }, []);

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
          // Supondo que o endpoint retorne { votes: { "Feliz": 5, "Triste": 3, ... } }
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
          body: JSON.stringify({ date: newDate }),
        });
        if (res.ok) {
          const result = await res.json();
          // result.newDate é um objeto com _id, teacher e date
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
        // Se a data excluída estava selecionada, des-seleciona
        if (selectedDate && selectedDate._id === id) {
          setSelectedDate(null);
        }
      }
    } catch (error) {
      console.error("Erro ao excluir data:", error);
    }
  };

  const selectDate = (dateObj) => {
    setSelectedDate(
      selectedDate && selectedDate._id === dateObj._id ? null : dateObj
    );
  };

  // Redireciona para /emotion-selection/:classId/:studentId
  const selectStudent = (student) => {
    if (classId) {
      navigate(`/emotion-selection/${classId}/${student._id}`);
    } else {
      console.error("ID da turma não definido.");
    }
  };

  return (
    <main className="container mx-auto mt-2 shadow p-4 rounded-b-sm">
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
                className="mt-2 text-black py-2 px-4 rounded cursor-pointer"
                onClick={() => selectDate(dateObj)}
              >
                {dateObj.date} ▼
              </button>
              <button
                onClick={() => deleteDate(dateObj._id)}
                className="mt-2 text-[#B8621B] hover:underline cursor-pointer"
              >
                Excluir
              </button>
            </div>
            {selectedDate && selectedDate._id === dateObj._id && (
              <div className="mt-2">
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
                    return (
                      <div key={label} className="text-center">
                        <img
                          src={image}
                          alt={label}
                          className="mx-auto w-12 h-12"
                        />
                        <div className="relative h-6 w-full bg-gray-300 mt-2">
                          <div
                            className="h-full bg-[#262A56]"
                            style={{
                              width: `${
                                ((votes[label] || 0) / students.length) * 100
                              }%`,
                            }}
                          ></div>
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#B8621B]">
                            {votes[label] || 0}/{students.length}
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
