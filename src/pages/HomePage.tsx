import { useEffect, useState } from "react";
import Header from "../components/Header";
import Light from "../components/Light";
import SearchBar from "../components/SearchBar";
import SongDetailPanel from "../components/SongDetailPanel";
import api from "../api/axios";
import type { Track } from "../types/track";
import ScrollableSongList from "../components/ScrollableSongList.tsx";

const getTopTracks = async (): Promise<Track[]> => {
    const res = await api.get("/api/spotify/top-tracks");
    return res.data;
};

export default function HomePage() {
    const [selectedSong, setSelectedSong] = useState<Track | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [searchResults, setSearchResults] = useState<Track[] | null>(null);

    const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;

        const fetchLiked = async () => {
            try {
                const res = await api.get("/track/liked", { params: { userId }});

                const ids = res.data.map(
                    (t: { spotifyTrackId: string }) => t.spotifyTrackId
                );

                setLikedTrackIds(new Set(ids));
            } catch (err) {
                console.error(err);
            }
        };

        fetchLiked();
    }, [userId]);


    const toggleLike = async (trackId: string) => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const isLiked = likedTrackIds.has(trackId);

        try {
            if (isLiked) {
                await api.delete("/track/unlike", {
                    params: { userId, trackId }
                });
            } else {
                await api.post("/track/like", null, {
                    params: { userId, trackId }
                });
            }

            setLikedTrackIds(prev => {
                const next = new Set(prev);
                if (isLiked) next.delete(trackId);
                else next.add(trackId);
                return next;
            });

        } catch (err) {
            console.error(err);
        }
    };

    const searchTracks = async (query: string) => {
        if (!query.trim()) {
            setSearchResults(null);
            return;
        }

        const res = await api.get(`/api/spotify/search?q=${query}&limit=49`);
        const items = res.data.tracks.items;

        setSearchResults(items);
    };

    useEffect(() => {
        getTopTracks().then(setTopTracks).catch(console.error);
    }, []);


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

            <main
                className="px-20 overflow-y-scroll"
                style={{
                    height: "calc(100vh - 130px)",
                    marginTop: "150px"
                }}
            >
                <div className="flex-1 pr-10 pb-20 max-w-[900px]">

                    <SearchBar onSearch={searchTracks} />

                    {searchResults && (
                        <>
                            <h2 className="text-lg font-bold mt-10 mb-4">검색 결과</h2>

                            {Array.from({ length: Math.ceil(searchResults.length / 7) }).map((_, idx) => {
                                const start = idx * 7;
                                const end = start + 7;
                                const slice = searchResults.slice(start, end);

                                return (
                                    <ScrollableSongList
                                        key={idx}
                                        songs={slice}
                                        onSelectSong={setSelectedSong}
                                        likedTrackIds={likedTrackIds}
                                        onToggleLike={toggleLike}
                                        hideTitle={true}
                                    />
                                );
                            })}
                        </>
                    )}

                    {!searchResults && (
                        <>
                            <ScrollableSongList
                                title="Spotify 인기 차트"
                                songs={topTracks.slice(0, 7)}
                                onSelectSong={setSelectedSong}
                                likedTrackIds={likedTrackIds}
                                onToggleLike={toggleLike}
                            />

                            <ScrollableSongList
                                title="당신에게 맞는 추천 곡"
                                songs={topTracks.slice(7, 14)}
                                onSelectSong={setSelectedSong}
                                likedTrackIds={likedTrackIds}
                                onToggleLike={toggleLike}
                            />

                            <ScrollableSongList
                                title="Spotify 인기 차트"
                                songs={topTracks.slice(14, 20)}
                                onSelectSong={setSelectedSong}
                                likedTrackIds={likedTrackIds}
                                onToggleLike={toggleLike}
                            />
                        </>
                    )}
                </div>

                {selectedSong && (
                    <SongDetailPanel
                        key={selectedSong.id}
                        song={selectedSong}
                        onClose={() => setSelectedSong(null)}
                        liked={likedTrackIds.has(selectedSong.spotify_track_id ?? selectedSong.id)}
                        onToggleLike={toggleLike}
                    />
                )}
            </main>
        </div>
    );
}
