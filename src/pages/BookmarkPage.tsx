import { useEffect, useState } from "react";
import Header from "../components/Header";
import Light from "../components/Light";
import api from "../api/axios";

import VerticalSongList from "../components/VerticalSongList";
import ScrollableSongList from "../components/ScrollableSongList";

import type { BookmarkTrack, Track } from "../types/track";

export default function BookmarkPage() {
    const [savedTracks, setSavedTracks] = useState<(BookmarkTrack & { imageUrl?: string })[]>([]);
    const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

    const [recommended, setRecommended] = useState<Track[]>([]);

    const userId = localStorage.getItem("userId");

    // ⭐ Spotify 트랙 이미지 가져오기
    const fetchSpotifyImage = async (spotifyTrackId: string) => {
        try {
            const res = await api.get(`/api/spotify/track/${spotifyTrackId}`);
            return res.data?.album?.images?.[0]?.url ?? null;
        } catch {
            return null;
        }
    };

    // ⭐ DB 저장곡 호출 + 이미지 보강
    useEffect(() => {
        if (!userId) return;

        const fetchBookmarks = async () => {
            try {
                const res = await api.get("/track/liked", { params: { userId } });

                const raw = res.data as BookmarkTrack[];

                // 좋아요 체크 세트
                setLikedTrackIds(new Set(raw.map((t) => t.spotifyTrackId)));

                // ⭐ 각각 이미지 URL 가져오기
                const enriched = await Promise.all(
                    raw.map(async (t) => {
                        const img = await fetchSpotifyImage(t.spotifyTrackId);
                        return { ...t, imageUrl: img ?? undefined };
                    })
                );

                setSavedTracks(enriched);

            } catch (err) {
                console.error(err);
            }
        };

        fetchBookmarks();
    }, [userId]);


    // 오른쪽 추천곡
    useEffect(() => {
        const fetchTop = async () => {
            const res = await api.get("/api/spotify/top-tracks");
            setRecommended(res.data);
        };
        fetchTop();
    }, []);

    // 좋아요 토글
    const toggleLike = async (spotifyTrackId: string) => {
        if (!userId) return;

        const isLiked = likedTrackIds.has(spotifyTrackId);

        try {
            if (isLiked) {
                await api.delete("/track/unlike", {
                    params: { userId, trackId: spotifyTrackId },
                });
            } else {
                await api.post("/track/like", null, {
                    params: { userId, trackId: spotifyTrackId },
                });
            }

            // 프론트 상태 업데이트
            setLikedTrackIds((prev) => {
                const next = new Set(prev);
                if (isLiked) next.delete(spotifyTrackId);
                else next.add(spotifyTrackId);
                return next;
            });

            // 좌측 패널 제거
            if (isLiked) {
                setSavedTracks((prev) =>
                    prev.filter((t) => t.spotifyTrackId !== spotifyTrackId)
                );
            }

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="w-full h-screen text-white overflow-hidden relative">

            <div className="fixed top-0 left-0 w-full z-50">
                <div className="px-20 py-6">
                    <Header isLoggedIn={true} />
                </div>
            </div>

            <div className="absolute inset-0 -z-10">
                <Light variant="home" />
            </div>

            {/* Layout */}
            <div className="flex w-full h-full pt-[150px] px-20">

                {/* LEFT PANEL */}
                <div className="w-[320px] flex-shrink-0 mr-10">
                    <h2 className="text-xl font-semibold mb-4">내가 저장한 곡</h2>

                    <div className="h-[calc(100vh-200px)] overflow-y-scroll pr-3">
                        <VerticalSongList
                            tracks={savedTracks}
                            likedTrackIds={likedTrackIds}
                            onToggleLike={toggleLike}
                        />
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <main
                    className="flex-1 overflow-y-scroll pr-10"
                    style={{ height: "calc(100vh - 200px)" }}
                >
                    <h2 className="text-xl font-semibold mb-6">추천 플레이리스트</h2>

                    <ScrollableSongList
                        title="요즘 많이 듣는 노래"
                        songs={recommended.slice(0, 7)}
                        onSelectSong={() => {}}
                        likedTrackIds={likedTrackIds}
                        onToggleLike={toggleLike}
                    />

                    <ScrollableSongList
                        title="비슷한 취향 모음"
                        songs={recommended.slice(7, 14)}
                        onSelectSong={() => {}}
                        likedTrackIds={likedTrackIds}
                        onToggleLike={toggleLike}
                    />
                </main>
            </div>
        </div>
    );
}
