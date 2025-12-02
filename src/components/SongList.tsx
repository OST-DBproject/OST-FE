import type { UnifiedTrack } from "../types/track";
import LikeNormal from "../assets/Like-normal.svg";
import LikeActive from "../assets/Like-active.svg";

interface SongListProps {
    onSelectSong: (song: UnifiedTrack) => void;
    songs?: UnifiedTrack[];
    likedTrackIds: Set<string>;
    onToggleLike: (trackId: string) => void;
}

export default function SongList({
                                     onSelectSong,
                                     songs = [],
                                     likedTrackIds,
                                     onToggleLike
                                 }: SongListProps) {

    return (
        <div className="flex gap-6 py-4">
            {songs.map((song) => {
                const img =
                    song.imageUrl ||
                    song.album?.images?.[0]?.url ||
                    "";

                const artist =
                    song.artistName ||
                    song.artists?.[0]?.name ||
                    "";

                const spotifyId = song.spotifyTrackId ?? song.id;

                const isLiked = likedTrackIds.has(spotifyId);

                return (
                    <div
                        key={spotifyId}
                        className="cursor-pointer w-40"
                        onClick={() => onSelectSong(song)}
                    >
                        <div className="w-40 h-40 bg-[#1f1f1f] rounded-lg overflow-hidden">
                            {img && (
                                <img
                                    src={img}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm font-medium truncate w-[75%]">
                                {song.name}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleLike(spotifyId);
                                }}
                            >
                                <img
                                    src={isLiked ? LikeActive : LikeNormal}
                                    className="w-6 h-6"
                                />
                            </button>
                        </div>

                        <div className="text-xs text-gray-400 truncate">
                            {artist}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
