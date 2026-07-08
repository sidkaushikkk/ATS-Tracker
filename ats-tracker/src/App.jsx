import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import GenerateResume from "./pages/GenerateResume.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/generate-resume" element={<GenerateResume />} />
    </Routes>
  );
}

export default App;