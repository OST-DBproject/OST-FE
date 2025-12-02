import { useRef } from "react";
import SongList from "./SongList";
import type { Track } from "../types/track";

interface Props {
    title?: string;
    hideTitle?: boolean;
    songs: Track[];
    onSelectSong: (song: Track) => void;
    likedTrackIds: Set<string>;
    onToggleLike: (trackId: string) => void;
}

export default function ScrollableSongList({
                                               title,
                                               hideTitle = false,
                                               songs,
                                               onSelectSong,
                                               likedTrackIds,
                                               onToggleLike
                                           }: Props) {

    const ref = useRef<HTMLDivElement>(null);

    const scrollLeft = () => ref.current?.scrollBy({ left: -300, behavior: "smooth" });
    const scrollRight = () => ref.current?.scrollBy({ left: 300, behavior: "smooth" });

    return (
        <section className="mt-10 relative">

            {!hideTitle && (
                <h2 className="text-lg font-bold mb-6">{title}</h2>
            )}

            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-3 rounded-full hover:bg-black/60"
            >
                ‹
            </button>

            <div ref={ref} className="overflow-x-auto scrollbar-hide">
                <SongList
                    songs={songs}
                    onSelectSong={onSelectSong}
                    likedTrackIds={likedTrackIds}
                    onToggleLike={onToggleLike}
                />
            </div>

            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/40 p-3 rounded-full hover:bg-black/60"
            >
                ›
            </button>
        </section>
    );
}
