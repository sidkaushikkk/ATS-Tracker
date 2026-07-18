import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import GenerateResume from "./pages/GenerateResume.jsx";
import { UploadResume } from "./pages/UploadResume.jsx";
import AnalyzePage from "./pages/ResumeAnalyzations/AnalyzePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate-resume" element={<GenerateResume />} />
      <Route path="/upload-resume" element={<UploadResume />} />
      <Route path="/analysis" element={<AnalyzePage />} />
    </Routes>
  );
}

export default App;