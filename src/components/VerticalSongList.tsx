import VerticalSongItem from "./VerticalSongItem";
import type { BookmarkTrack } from "../types/track";

interface Props {
    tracks: BookmarkTrack[];
    likedTrackIds: Set<string>;
    onToggleLike: (id: string) => void;
}

export default function VerticalSongList({ tracks, likedTrackIds, onToggleLike }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {tracks.map((track) => (
                <VerticalSongItem
                    key={track.spotifyTrackId}
                    track={track}
                    isLiked={likedTrackIds.has(track.spotifyTrackId)}
                    onToggleLike={onToggleLike}
                />
            ))}
        </div>
    );
}
