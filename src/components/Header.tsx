import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";   // ← 추가
import HeaderActive from "../assets/Header-active.svg";
import HeaderNormal from "../assets/Header-nomal.svg";

type HeaderProps = {
    isLoggedIn: boolean;
    onLogout?: () => void;
    nickname?: string;
};

export default function Header({ isLoggedIn, onLogout, nickname}: HeaderProps) {
    const navigate = useNavigate();   // ← 추가
    const [isBookmarkActive, setIsBookmarkActive] = useState(false);

    const [nicknameState] = useState(() => {
        const stored = localStorage.getItem("nickname");
        return stored ?? nickname ?? "";
    });

    const handleBookmarkClick = () => {
        setIsBookmarkActive((prev) => !prev);
        navigate("/book");   // ← 여기서 바로 /book 페이지로 이동
    };

    const handleLogout = () => {
        onLogout?.();
        localStorage.removeItem("nickname");
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-300">
            <Link to="/home" className="text-white text-5xl font-hs font-nomal">
                OST
            </Link>

            {isLoggedIn && (
                <div className="flex items-center gap-4">
                    <button type="button" onClick={handleBookmarkClick}>
                        <img
                            src={isBookmarkActive ? HeaderActive : HeaderNormal}
                            alt="bookmark"
                            className="w-8 h-8"
                        />
                    </button>

                    <span className="text-white text-xl font-pretendard">
                        {nickname ?? nicknameState}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-hover-white text-xl font-pretendard"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </header>
    );
}
