import type { BookmarkTrack } from "../types/track";
import LikeNormal from "../assets/Like-normal.svg";
import LikeActive from "../assets/Like-active.svg";

interface Props {
    track: BookmarkTrack;
    isLiked: boolean;
    onToggleLike: (spotifyId: string) => void;
}

export default function VerticalSongItem({ track, isLiked, onToggleLike }: Props) {
    return (
        <div className="flex items-center justify-between py-3 px-2 hover:bg-white/10 rounded-lg">

            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded" />

                <div>
                    <div className="text-sm font-semibold">{track.trackName}</div>
                    <div className="text-xs text-gray-400">{track.artistName}</div>
                </div>
            </div>

            <button onClick={() => onToggleLike(track.spotifyTrackId)}>
                <img
                    src={isLiked ? LikeActive : LikeNormal}
                    className="w-6 h-6"
                />
            </button>
        </div>
    );
}
