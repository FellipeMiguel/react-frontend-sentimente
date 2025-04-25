import React, { useState } from "react";
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

const emotions = [
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

export default function EmotionSelection() {
  const { classId, studentId } = useParams(); // A rota deve ser definida como: /emotion-selection/:classId/:studentId
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmotionClick = async (emotion) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      navigate("/login");
      return;
    }

    // Utiliza a data atual no formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${API_URL}/emotions/${classId}/student/${studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            emotion: emotion.label,
            date: today,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to record emotion.");
        setIsSubmitting(false);
      } else {
        setMessage("Emotion recorded successfully!");
        // Redireciona para ClassAnalytics após 1,5 segundos
        setTimeout(() => {
          navigate(`/class-analytics/${classId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      setError("Error connecting to server.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col shadow container mx-auto mt-2 bg-[#E3CCAE]">
      <main className="flex flex-col flex-grow items-center justify-center p-6 py-10 lg:py-30">
        <h2 className="text-xl font-semibold mb-4">
          Como você está se sentindo hoje?
        </h2>
        <div className="flex flex-wrap gap-4 lg:gap-10 px-10 lg:px-30">
          {emotions.map((item, index) => (
            <button
              key={index}
              onClick={() => handleEmotionClick(item)}
              className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
            >
              <img src={item.image} alt={item.label} className="w-20 h-15" />
              <span className="mt-2 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </main>
    </div>
  );
}
