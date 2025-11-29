import type { Track } from "../types/track.ts";

interface SongDetailPanelProps {
    song: Track;
    onClose: () => void;
}

export default function SongDetailPanel({ song, onClose }: SongDetailPanelProps) {
    return (
        <div
            className="w-[320px] min-h-[500px] bg-[#1c1d19] rounded-lg p-5 shadow-lg"
            style={{ position: "fixed", right: "80px", top: "140px", zIndex: 30 }}
        >
            <button
                onClick={onClose}
                className="text-gray-300 hover:text-white float-right"
            >
                ✕
            </button>

            <div className="w-full h-52 bg-[#333]">
                {song.imageUrl && (
                    <img
                        src={song.imageUrl}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="mt-6">
                <div className="text-lg font-semibold">{song.name}</div>
                <div className="text-sm text-gray-400">{song.artistName}</div>
            </div>

            <div className="mt-10">
                <p>댓글 기능 들어갈 자리</p>
            </div>
        </div>
    );
}
