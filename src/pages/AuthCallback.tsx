import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.ts";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (!code) return;

        if (sessionStorage.getItem("code_used")) return;
        sessionStorage.setItem("code_used", "true");

        api.post("/auth/callback", { code })
            .then(async (res) => {
                const nickname = res.data.nickname;
                const profileImage = res.data.profileImage;

                const loginRes = await api.post("/user/login", null, {
                    params: {
                        spotifyId: res.data.spotifyId,
                        name: nickname,
                        image: profileImage

                    }
                });

                localStorage.setItem("nickname", loginRes.data.displayName);
                localStorage.setItem("spotifyId", loginRes.data.spotifyId);

                navigate("/home");
            })
            .catch((err) => console.error(err));

    }, []);


    return (
        <div style={{ color: "white", padding: "40px" }}>
            로그인 처리 중...
        </div>
    );
}
