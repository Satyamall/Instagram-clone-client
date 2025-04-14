export interface InstagramProfile {
    id: string;
    username: string;
    account_type: string;
    media_count: number;
}

export interface InstagramMedia {
    id: string;
    caption?: string;
    media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    media_url: string;
    permalink: string;
    timestamp: string;
    comments_count?: number;
}

export interface InstagramComment {
    id: string;
    text: string;
    username: string;
    timestamp: string;
    replies?: InstagramComment[];
}

export interface ApiError {
    message: string;
    status?: number;
}