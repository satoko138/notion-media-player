import React, { useEffect, useState } from 'react';
import { GetMediaListResult, MediaInfo } from '../types/api-types';

type Props = {
}

export default function MediaList(props: Props) {
    const [ medias, setMedias ] = useState<MediaInfo[]>([]);
    const [ nextCursor, setNextCursor ] = useState<string | undefined>();

    // useEfectじゃない方が適切かもしれないけれど、ひとまず
    useEffect(() => {
        fetch('/api/list').then((res) => {
            return res.json();
        }).then((result: GetMediaListResult) => {
            setMedias(result.medias);
            setNextCursor(result.next_cursor);
        });
    }, []);

    return (
        <table>
            <tbody>
                {medias.map(media => {
                    return (
                        <tr key={media.id}>
                            <td>
                                {media.title}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}