export interface Track {
    id: string;
    spotify_track_id?: string;
    name: string;
    imageUrl?: string;
    artistName?: string;
    album?: {
        images: { url: string }[];
    };
    artists?: {
        name: string;
    }[];
}
export interface UnifiedTrack {
    id: string;
    name: string;
    imageUrl?: string;
    artistName?: string;
    album?: { images: { url: string }[] };
    artists?: { name: string }[];

    spotifyTrackId?: string;
}
export interface BookmarkTrack {
    spotifyTrackId: string;
    trackName: string;
    artistName: string;
    albumName: string;
    likedAt: string;
    id: number;
}



