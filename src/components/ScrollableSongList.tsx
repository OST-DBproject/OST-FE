import { useRef } from "react";
import SongList from "./SongList";
import type { Track } from "../types/track";

interface Props {
    title: string;
    songs: Track[];
    onSelectSong: (song: Track) => void;
}

export default function ScrollableSongList({ title, songs, onSelectSong }: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const scrollLeft = () => ref.current?.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = () => ref.current?.scrollBy({ left: 300, behavior: "smooth" });

    return (
        <section className="mt-14 relative">
            <h2 className="text-xl mb-6 font-hs">{title}</h2>

            {/* 왼쪽 버튼 */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-3 rounded-full hover:bg-black/60"
            >
                ‹
            </button>

            {/* 스크롤 가능한 리스트 */}
            <div ref={ref} className="overflow-x-auto scrollbar-hide">
                <SongList songs={songs} onSelectSong={onSelectSong} />
            </div>

            {/* 오른쪽 버튼 */}
            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-3 rounded-full hover:bg-black/60"
            >
                ›
            </button>
        </section>
    );
}
