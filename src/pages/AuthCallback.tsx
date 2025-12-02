import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios.ts";

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        if (!code) return;

        const fetchData = async () => {
            try {
                const res = await api.post("/auth/callback", { code });

                const nickname = res.data.nickname;
                const profileImage = res.data.profileImage;
                const spotifyAccessToken = res.data.accessToken;

                const loginRes = await api.post("/user/login", null, {
                    params: {
                        spotifyId: res.data.spotifyId,
                        name: nickname,
                        image: profileImage
                    }
                });

                localStorage.setItem("userId", loginRes.data.id.toString());
                localStorage.setItem("nickname", loginRes.data.displayName);
                localStorage.setItem("spotifyId", loginRes.data.spotifyId);
                localStorage.setItem("spotifyAccessToken", spotifyAccessToken);

                navigate("/home", { replace: true });
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [location.search]);

    return (
        <div style={{ color: "white", padding: "40px" }}>
            로그인 처리 중...
        </div>
    );
}
