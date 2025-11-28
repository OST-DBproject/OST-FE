import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderActive from "../assets/Header-active.svg";
import HeaderNormal from "../assets/Header-nomal.svg";

type HeaderProps = {
    isLoggedIn: boolean;
    nickname?: string;
    onLogout?: () => void;
};

export default function Header({ isLoggedIn, nickname, onLogout }: HeaderProps) {
    const [isBookmarkActive, setIsBookmarkActive] = useState(false);

    const handleBookmarkClick = () => {
        setIsBookmarkActive((prev) => !prev);
    };

    const handleLogout = () => {
        onLogout?.();
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
                    <span className="text-white text-2xl font-semibold font-pretendard">{nickname ?? "닉네임"}</span>

                    <button type="button" onClick={handleLogout} className="text-hover-white text-2xl font-semibold font-pretendard">
                        로그아웃
                    </button>
                </div>
            )}
        </header>
    );
}
