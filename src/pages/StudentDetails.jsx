import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../config";

export default function StudentsPage() {
  const { classId } = useParams();
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [historyMap, setHistoryMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) navigate("/login");

  const formatDate = (iso) => {
    const [y, m, d] = iso.split("T")[0].split("-");
    return `${d}/${m}/${y}`;
  };

  // 1) buscar turma e alunos
  useEffect(() => {
    fetch(`${API_URL}/classes/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    })
      .then((res) => res.json())
      .then((cls) => {
        setClassName(cls.name);
        setStudents(cls.students || []);
      })
      .catch(() => navigate("/dashboard"));
  }, [classId, navigate, token]);

  // 2) para cada aluno, buscar histórico de emoções
  useEffect(() => {
    if (!students.length) {
      setLoading(false);
      return;
    }

    Promise.all(
      students.map((s) =>
        fetch(`${API_URL}/emotions/student/${s._id}?classId=${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((hist) => ({ id: s._id, history: hist.emotions || [] }))
      )
    )
      .then((results) => {
        const map = {};
        results.forEach(({ id, history }) => {
          map[id] = history;
        });
        setHistoryMap(map);
      })
      .finally(() => setLoading(false));
  }, [students, classId, token]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#E3CCAE]">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto my-4 p-4 bg-[#E3CCAE] shadow rounded">
      <h1 className="text-3xl font-bold text-center mb-6">{className}</h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-600">
          Nenhum aluno cadastrado nesta turma.
        </p>
      ) : (
        students.map((student) => {
          const history = historyMap[student._id] || [];
          return (
            <section key={student._id} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{student.name}</h2>
              {history.length === 0 ? (
                <p className="text-gray-600">Sem registros de sentimentos.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded">
                    <thead className="bg-[#F4E5D0]">
                      <tr>
                        <th className="px-4 py-2 border">Data</th>
                        <th className="px-4 py-2 border">Sentimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((entry, i) => (
                        <tr key={i} className="text-center">
                          <td className="px-4 py-2 border">
                            {formatDate(entry.date)}
                          </td>
                          <td className="px-4 py-2 border">{entry.emotion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })
      )}
    </main>
  );
}
