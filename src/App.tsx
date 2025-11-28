// src/App.tsx
import { Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import MainPage from "./pages/MainPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/main" element={<MainPage />} />
        </Routes>
    );
}

export default App;
