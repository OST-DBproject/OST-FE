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

    useEffect(() => {
        getTopTracks().then(setTopTracks).catch(console.error);
    }, []);

    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden">

            <Light variant="home" />

            <div className="px-20 pt-10 fixed top-0 left-0 w-full z-30">
                <Header isLoggedIn={true} nickname="닉네임" />
            </div>


            <main className="px-20 pt-44 flex relative z-10">

                <div className="flex-1 pr-10 max-w-[900px]">
                    <SearchBar />

                    <ScrollableSongList
                        title="Spotify 인기 차트"
                        songs={topTracks.slice(0, 10)}
                        onSelectSong={(song) => setSelectedSong(song)}
                    />

                    <ScrollableSongList
                        title="당신에게 맞는 추천 곡"
                        songs={topTracks.slice(10, 20)}   // 임시 예시
                        onSelectSong={(song) => setSelectedSong(song)}
                    />

                </div>

                {selectedSong && (
                    <SongDetailPanel
                        song={selectedSong}
                        onClose={() => setSelectedSong(null)}
                    />
                )}
            </main>
        </div>
    );
}
