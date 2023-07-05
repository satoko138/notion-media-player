export type MediaInfo = {
    id: string;
    title: string;
    publish_date: string;
}

export type GetMediaListResult = {
    medias: MediaInfo[];
    next_cursor?: string;
}