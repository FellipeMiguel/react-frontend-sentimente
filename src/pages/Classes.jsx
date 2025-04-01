import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Classes() {
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/classes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response status:", res.status);
        if (!res.ok) {
          setError("Failed to fetch classes.");
          setLoading(false);
        } else {
          const data = await res.json();
          console.log("Classes data:", data);
          setClassesList(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Error connecting to server.");
        setLoading(false);
      }
    };

    fetchClasses();
  }, [navigate]);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-[#E3CCAE]">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-[#E3CCAE]">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="container w-full mx-auto flex justify-center items-center mt-2 bg-[#E3CCAE]">
      <div className="w-full p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4 text-center">Turmas</h1>
        {classesList.length === 0 ? (
          <p className="text-center">Nenhuma turma encontrada.</p>
        ) : (
          <div className="flex flex-col">
            {classesList.map((classe) => (
              <div
                key={classe._id}
                className="flex justify-between items-center border-b-1 py-1 last:border-none"
              >
                <div key={classe._id} className="p-4 rounded">
                  <h2 className="text-xl font-bold">{classe.name}</h2>
                  <p className="mt-2">
                    Total de alunos: {classe.students.length}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => navigate(`/class-analytics/${classe._id}`)}
                    className="bg-[#F4E5D0] text-black py-2 px-4 rounded cursor-pointer hover:bg-[#F5DDBB]"
                  >
                    Ver turma
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
