import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import GenerateResume from "./pages/GenerateResume.jsx";
import { UploadResume } from "./pages/UploadResume.jsx";
import AnalyzePage from "./pages/ResumeAnalyzations/AnalyzePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import useBackendPing from "./hooks/useBackendPing.js";


function App() {
  
  useBackendPing();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate-resume" element={<GenerateResume />} />
      <Route path="/upload-resume" element={<UploadResume />} />
      <Route path="/analysis" element={<AnalyzePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;