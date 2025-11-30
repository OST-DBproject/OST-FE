export interface Track {
    id: string;
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

