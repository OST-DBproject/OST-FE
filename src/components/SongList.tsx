import { useState } from "react";
import type { Track } from "../types/track.ts";

import LikeNormal from "../assets/Like-normal.svg";
import LikeActive from "../assets/Like-active.svg";

interface SongListProps {
    onSelectSong: (song: Track) => void;
    songs?: Track[];
}

export default function SongList({ onSelectSong, songs = [] }: SongListProps) {
    const [likes, setLikes] = useState<{ [key: string]: boolean }>({});

    const toggleLike = (id: string) => {
        setLikes((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="flex gap-6 overflow-x-auto pb-4">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="w-40 cursor-pointer"
                    onClick={() => onSelectSong(song)}
                >
                    {/* 앨범 이미지 */}
                    <div className="relative w-40 h-40 bg-[#1f1f1f] rounded-lg overflow-hidden">
                        {song.imageUrl && (
                            <img
                                src={song.imageUrl}
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* 좋아요 버튼 (오른쪽 위) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(song.id);
                            }}
                            className="absolute top-2 right-2"
                        >
                            <img
                                src={likes[song.id] ? LikeActive : LikeNormal}
                                className="w-6 h-6"
                            />
                        </button>
                    </div>

                    <div className="mt-2 text-sm font-medium truncate">
                        {song.name}
                    </div>

                    <div className="text-xs text-gray-400 truncate">
                        {song.artistName}
                    </div>
                </div>
            ))}
        </div>
    );
}
