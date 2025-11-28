import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Light from "../components/Light";

export default function IntroPage() {
    const [scrollY, setScrollY] = useState(0);
    const [fade, setFade] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrollY(y);

            const fadeMax = 300;
            setFade(Math.max(0, 1 - y / fadeMax));

            if (y > window.innerHeight * 0.4) {
                setTimeout(() => {
                    navigate("/main", { replace: true });
                }, 600); // 전환 애니메이션 시간
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navigate]);

    return (
        <div className="relative w-full h-[180vh] text-white overflow-hidden">

            <Light variant="intro" scrollY={scrollY} />

            <div
                className="w-full h-screen flex flex-col justify-end px-20 pb-32 relative z-10 transition-opacity duration-500"
                style={{ opacity: fade }}
            >
                <h1 className="text-[140px] font-hs font-normal mb-10">OST</h1>

                <div className="flex items-center justify-between w-full">
                    <div className="flex-1 h-[1px] bg-white opacity-80 mr-5" />
                    <span className="text-2xl ">
            노래 검색 & 추천 서비스
          </span>
                </div>
            </div>
        </div>
    );
}
