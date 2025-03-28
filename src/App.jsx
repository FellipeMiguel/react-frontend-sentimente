import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateClass from "./pages/CreateClass";
import Classes from "./pages/Classes";
import ClassAnalytics from "./pages/ClassAnalytics";
import EmotionSelection from "./pages/EmotionSelection";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#E3CCAE]">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-class" element={<CreateClass />} />
          <Route path="/classes" element={<Classes />} />
          <Route
            path="/class-analytics/:classId"
            element={<ClassAnalytics />}
          />
          <Route
            path="/emotion-selection/:classId/:studentId"
            element={<EmotionSelection />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
