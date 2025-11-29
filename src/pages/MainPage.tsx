import { useEffect, useState } from "react";
import Light from "../components/Light";
import Header from "../components/Header";
import mainImage from "../assets/main.png";

export default function MainPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 10);
    }, []);

    return (
        <div className="relative w-full min-h-screen bg-[#0F110D] text-white overflow-hidden">

            <Light variant="main" />

            <div
                style={{
                    position: "fixed",
                    top: "200px",
                    right: "80px",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            >
                <img
                    src={mainImage}
                    style={{
                        width: "764px",
                        height: "430px",
                        objectFit: "cover",
                        display: "block",
                        opacity:0.7,
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent 5%, black 70%, black 100%)",
                        maskImage:
                            "linear-gradient(to right, transparent 5%, black 70%, black 100%)",
                    }}
                />
            </div>


            <div className="px-20 relative z-10">
                <Header isLoggedIn={false} />
            </div>

            <main
                className={`
                    relative z-10 px-20 pt-60 transition-all duration-700
                    ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
            >
                <h2 className="text-[32px] font-hs mb-6">
                    나만의 노래 저장소 OST에 오신걸 환영해요!
                </h2>

                <p className="text-xl font-hs mb-32">
                    지금 바로 Spotify Login을 통해 OST의 기능을 체험해보세요.
                </p>

                <button
                    className="px-10 py-4 border border-white text-lg hover:border-primary-100 transition-colors"
                    onClick={() =>
                        window.location.href =
                            `https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(import.meta.env.VITE_FRONT_REDIRECT_URI)}&scope=user-library-read%20user-library-modify`
                    }
                >
                    Spotify Login
                </button>

            </main>
        </div>
    );
}
