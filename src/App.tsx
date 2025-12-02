// src/App.tsx
import { Routes, Route } from "react-router-dom";
import IntroPage from "./pages/IntroPage";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage.tsx";
import AuthCallback from "./pages/AuthCallback";
import BookmarkPage from "./pages/BookmarkPage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/book" element={<BookmarkPage/>}/>

        </Routes>
    );
}

export default App;
