export type MediaInfo = {
    id: string;
    title: string;
    publish_date: string;
}
export type GetMediaListParam = {
    ketword?: string;
    cursor?: string;
}

export type GetMediaListResult = {
    medias: MediaInfo[];
    next_cursor?: string;
}

export type GetMediaPathParam = {
    id: string;
}

export type GetMediaPathResult = {
    path: string;
}