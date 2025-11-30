import { useState, useEffect } from "react";
import type { Track } from "../types/track.ts";
import PlayIcon from "../assets/play.svg";
import LikeNormal from "../assets/Like-normal.svg";
import LikeActive from "../assets/Like-active.svg";
import ChatIcon from "../assets/chat.svg";
import CloseIcon from "../assets/close.svg";
import api from "../api/axios";

interface SongDetailPanelProps {
    song: Track;
    onClose: () => void;
}

interface CommentItem {
    id: number;
    trackId: string;
    content: string;
    user: {
        spotifyId: string;
        displayName: string;
        profileImage: string | null;
        id: number;
    };
}

export default function SongDetailPanel({ song, onClose }: SongDetailPanelProps) {
    const img =
        song.imageUrl ||
        song.album?.images?.[0]?.url ||
        "";

    const artist =
        song.artistName ||
        song.artists?.[0]?.name ||
        "";

    const userId = localStorage.getItem("spotifyId") ?? "";

    const [progress, setProgress] = useState(0);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 30) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return 30;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        if (!song.id) return;

        const fetchComments = async () => {
            const res = await api.get("/comments", {
                params: { trackId: song.id }
            });
            setComments(res.data);
        };

        fetchComments();
    }, [song.id]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        const res = await api.post("/comment", null, {
            params: {
                spotifyId: userId,
                trackId: song.id,
                content: newComment
            }
        });

        const savedComment = res.data;
        setComments(prev => [savedComment, ...prev]);
        setNewComment("");
    };

    const handleDelete = async (id: number) => {
        await api.delete(`/comment/${id}`);
        setComments(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div
            className="w-[340px] min-h-[650px] max-h-[650px] rounded-lg p-5 shadow-lg text-white"
            style={{
                position: "fixed",
                right: "80px",
                top: "150px",
                zIndex: 30,
                background: "rgba(28,29,25,0.8)",
            }}
        >
            <button onClick={onClose} className="pb-2 float-right">
                <img src={CloseIcon} className="w-6 h-6" />
            </button>

            <div className="w-full h-60 bg-[#333] overflow-hidden">
                {img && <img src={img} className="w-full h-full object-cover" />}
            </div>

            <div className="mt-5 flex justify-between items-start">
                <div>
                    <div className="text-lg font-semibold truncate max-w-[250px]">
                        {song.name}
                    </div>
                    <div className="text-sm text-gray-400 truncate max-w-[250px]">
                        {artist}
                    </div>
                </div>

                <button onClick={() => setLiked(prev => !prev)}>
                    <img
                        src={liked ? LikeActive : LikeNormal}
                        className="w-7 h-7"
                    />
                </button>
            </div>

            <div className="flex items-center gap-4 mt-3">
                <div className="flex-1 flex flex-col justify-center">
                    <div className="relative h-1.5 bg-background rounded-lg overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-primary-300"
                            style={{ width: `${(progress / 30) * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0:00</span>
                        <span>0:30</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setProgress(0);
                        setIsPlaying(true);
                    }}
                    className="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center"
                >
                    <img src={PlayIcon} className="w-5 h-5 pl-[2px]" />
                </button>
            </div>

            <div className="mt-6 bg-[rgba(28,29,25,0.8)] p-3">
                {!isCommentOpen && (
                    <button
                        onClick={() => setIsCommentOpen(true)}
                        className="flex items-center gap-2 w-full text-left"
                    >
                        <img src={ChatIcon} className="w-5 h-5" />
                        <span className="text-sm text-gray-300">{comments.length}</span>
                    </button>
                )}

                {isCommentOpen && (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <img src={ChatIcon} className="w-5 h-5" />
                                <span className="text-sm text-gray-300">{comments.length}</span>
                            </div>

                            <button
                                onClick={() => setIsCommentOpen(false)}
                                className="text-gray-300 hover:text-white"
                            >
                                <img src={CloseIcon} className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[150px] overflow-y-auto pr-1 space-y-3">
                            <div className="bg-[#3a3b36] p-2 flex items-center mb-3">
                                <div className="w-4 h-4 bg-white rounded-full mr-2"></div>

                                <input
                                    placeholder="댓글을 입력하세요"
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyUp={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddComment();
                                        }
                                    }}
                                />
                            </div>

                            {comments.map((c) => (
                                <div key={c.id} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-white rounded-full" />
                                    <span className="text-sm">{c.content}</span>

                                    {c.user.spotifyId === userId && (
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            className="text-xs text-white ml-auto"
                                        >
                                            <img src={CloseIcon} className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
