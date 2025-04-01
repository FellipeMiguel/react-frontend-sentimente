import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

export default function CreateClass() {
  const [className, setClassName] = useState("");
  // Inicialmente, um campo de aluno vazio
  const [students, setStudents] = useState([{ name: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Atualiza o nome de um aluno na posição index
  const handleStudentNameChange = (index, value) => {
    const newStudents = [...students];
    newStudents[index].name = value;
    setStudents(newStudents);
    if (value.trim() !== "") setError(""); // Limpa o erro se o campo for preenchido
  };

  // Adiciona um novo campo de aluno, mas só se o último campo estiver preenchido
  const addStudentField = () => {
    // Verifica se o último campo está vazio
    if (
      students.length > 0 &&
      students[students.length - 1].name.trim() === ""
    ) {
      setError("Preencha o campo do aluno antes de adicionar outro.");
      return;
    }
    setError("");
    setStudents([...students, { name: "" }]);
  };

  // Remove um campo de aluno
  const removeStudentField = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!className.trim()) {
      setError("O nome da turma é obrigatório.");
      return;
    }
    // Verifica se há algum campo vazio
    if (students.some((student) => student.name.trim() === "")) {
      setError(
        "Remova os campos vazios ou preencha todos os nomes dos alunos."
      );
      return;
    }
    const filteredStudents = students.filter(
      (student) => student.name.trim() !== ""
    );
    if (filteredStudents.length === 0) {
      setError("Adicione pelo menos um aluno.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/classes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: className, students: filteredStudents }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setSuccess("Turma criada com sucesso!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (err) {
      setError("Erro ao conectar ao servidor.", err);
    }
  };

  return (
    <main className="flex items-center justify-center container mt-2 shadow mx-auto py-20 bg-[#E3CCAE]">
      <div className="max-w-md w-full rounded p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Criar Turma</h1>
        {error && <p className="text-[#B8621B] mb-4 text-center">{error}</p>}
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
            <h2 className="text-lg font-semibold">Alunos</h2>
            {students.map((student, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Nome do aluno"
                  className="flex-grow p-2 bg-[#F4E5D0] rounded-md outline-none"
                  value={student.name}
                  onChange={(e) =>
                    handleStudentNameChange(index, e.target.value)
                  }
                />
                {students.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStudentField(index)}
                    className="ml-2 text-[#B8621B]"
                  >
                    Excluir
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStudentField}
              className="mt-2 text-blue-500 hover:underline"
            >
              Adicionar Aluno
            </button>
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
