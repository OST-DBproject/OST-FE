import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderActive from "../assets/Header-active.svg";
import HeaderNormal from "../assets/Header-nomal.svg";

type HeaderProps = {
    isLoggedIn: boolean;
    onLogout?: () => void;
};

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
    const [isBookmarkActive, setIsBookmarkActive] = useState(false);
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("nickname");
        if (stored) setNickname(stored);
    }, []);

    const handleBookmarkClick = () => {
        setIsBookmarkActive((prev) => !prev);
    };

    const handleLogout = () => {
        onLogout?.();
        localStorage.removeItem("nickname");
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-300">
            <Link to="/" className="text-white text-5xl font-hs font-nomal">
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

                    <span className="text-white text-xl font-semibold font-pretendard">
                        {nickname}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-hover-white text-xl font-semibold font-pretendard"
                    >
                        로그아웃
                    </button>
                </div>
            )}
        </header>
    );
}
