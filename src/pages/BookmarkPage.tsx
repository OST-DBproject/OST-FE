import { useEffect, useState } from "react";
import Header from "../components/Header";
import Light from "../components/Light";
import api from "../api/axios";

import VerticalSongList from "../components/VerticalSongList";
import ScrollableSongList from "../components/ScrollableSongList";

import type { BookmarkTrack, Track } from "../types/track";

interface AutoPlaylist {
    title: string;
    tracks: Track[];
}

export default function BookmarkPage() {
    const [savedTracks, setSavedTracks] = useState<(BookmarkTrack & { imageUrl?: string })[]>([]);
    const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set());

    const [autoPlaylists, setAutoPlaylists] = useState<AutoPlaylist[]>([]);

    const userId = localStorage.getItem("userId");

    const fetchSpotifyImage = async (spotifyTrackId: string) => {
        try {
            const res = await api.get(`/api/spotify/track/${spotifyTrackId}`);
            return res.data?.album?.images?.[0]?.url ?? null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        if (!userId) return;

        const fetchBookmarks = async () => {
            try {
                const res = await api.get("/track/liked", { params: { userId } });

                const raw = res.data as BookmarkTrack[];

                setLikedTrackIds(new Set(raw.map((t) => t.spotifyTrackId)));

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

    useEffect(() => {
        if (!userId) return;

        const fetchAutoPlaylists = async () => {
            try {
                const resArtist = await api.get("/track/group/artist", {
                    params: { userId },
                });

                const resDate = await api.get("/track/group/date", {
                    params: { userId },
                });

                const artistGroup = resArtist.data as Record<string, BookmarkTrack[]>;
                const dateGroup = resDate.data as Record<string, BookmarkTrack[]>;

                const playlists: AutoPlaylist[] = [];

                const findImageUrl = (spotifyTrackId: string) =>
                    savedTracks.find((s) => s.spotifyTrackId === spotifyTrackId)?.imageUrl;

                for (const artist of Object.keys(artistGroup)) {
                    const list = artistGroup[artist];

                    if (list.length >= 3) {
                        playlists.push({
                            title: `${artist} 곡 끼리 묶어봤어요 - ${list.length}`,
                            tracks: list.map((t) => ({
                                id: t.spotifyTrackId,
                                name: t.trackName,
                                artistName: t.artistName,
                                imageUrl: findImageUrl(t.spotifyTrackId),
                            })),
                        });
                    }
                }

                for (const date of Object.keys(dateGroup)) {
                    const list = dateGroup[date];

                    if (list.length >= 3) {
                        const month = date.substring(0, 7);

                        playlists.push({
                            title: `${month} 에 저장한 곡 끼리 묶어봤어요 - ${list.length}`,
                            tracks: list.map((t) => ({
                                id: t.spotifyTrackId,
                                name: t.trackName,
                                artistName: t.artistName,
                                imageUrl: findImageUrl(t.spotifyTrackId),
                            })),
                        });
                    }
                }

                setAutoPlaylists(playlists);

            } catch (err) {
                console.error(err);
            }
        };

        fetchAutoPlaylists();
    }, [savedTracks, userId]);



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

            setLikedTrackIds((prev) => {
                const next = new Set(prev);
                if (isLiked) next.delete(spotifyTrackId);
                else next.add(spotifyTrackId);
                return next;
            });

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
                    <Header isLoggedIn={true} isBookmarkPage={true} />
                </div>
            </div>

            <div className="absolute inset-0 -z-10">
                <Light variant="bookmark" />
            </div>

            <div className="flex w-full h-full pt-[150px] px-20">

                <div className="w-[320px] flex-shrink-0 mr-10">
                    <h2 className="text-lg font-semibold mb-4">내가 저장한 곡</h2>

                    <div className="h-[calc(100vh-200px)] overflow-y-scroll pr-3">
                        <VerticalSongList
                            tracks={savedTracks}
                            likedTrackIds={likedTrackIds}
                            onToggleLike={toggleLike}
                        />
                    </div>
                </div>

                <main
                    className="flex-1 overflow-y-scroll pr-10"
                    style={{ height: "calc(100vh - 200px)" }}
                >
                    <h2 className="text-lg font-semibold mb-6">자동 생성된 플레이리스트</h2>

                    {autoPlaylists.length === 0 && (
                        <p className="text-gray-400">3곡 이상인 분류가 없어 아직 자동 플리가 없어요.</p>
                    )}

                    {autoPlaylists.map((pl, idx) => (
                        <ScrollableSongList
                            key={idx}
                            title={pl.title}
                            songs={pl.tracks}
                            onSelectSong={() => {}}
                            likedTrackIds={likedTrackIds}
                            onToggleLike={toggleLike}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
}
