import { Link, useNavigate } from "react-router-dom";
import HeaderActive from "../assets/Header-active.svg";
import HeaderNormal from "../assets/Header-nomal.svg";
import { useState } from "react";
import api from "../api/axios";

type HeaderProps = {
    isLoggedIn: boolean;
    onLogout?: () => void;
    nickname?: string;
    isBookmarkPage?: boolean;
};

export default function Header({ isLoggedIn, onLogout, nickname, isBookmarkPage }: HeaderProps) {
    const navigate = useNavigate();

    const [nicknameState] = useState(() => {
        const stored = localStorage.getItem("nickname");
        return stored ?? nickname ?? "";
    });

    const handleBookmarkClick = () => {
        navigate("/book");
    };

    const handleLogout = async () => {
        const ok = window.confirm("정말 로그아웃 하시겠습니까?");
        if (!ok) return;

        const userId = localStorage.getItem("userId");
        if (!userId) return;

        try {
            await api.delete("/user/delete", { params: { userId } });
        } catch (err) {
            console.error("회원탈퇴 실패:", err);
        }

        onLogout?.();
        localStorage.clear();
        navigate("/", { replace: true });
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
                            src={isBookmarkPage ? HeaderActive : HeaderNormal}
                            alt="bookmark"
                            className="w-8 h-8"
                        />
                    </button>

                    <span className="text-white text-xl font-pretendard">
                        {nicknameState}
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
