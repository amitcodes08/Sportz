import { Route, Routes } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MatchDetail from "./pages/MatchDetail";

function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <AnimatedBackground />
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
