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
        <table className='w-full text-base text-left text-gray-500 dark:text-gray-400'>
            <thead className='text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                    <th className='px-6 py-2'>
                        配信日
                    </th>
                    <th className='px-6 py-2'>
                        タイトル
                    </th>
                    <th className='px-6 py-2'>
                        再生
                    </th>
                </tr>
            </thead>
            <tbody>
                {medias.map(media => {
                    return (
                        <tr key={media.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                            <td className='px-6 py-3'>
                                {media.publish_date}
                            </td>
                            <td className='px-6 py-3'>
                                {media.title}
                            </td>
                            <td className='px-6 py-3'>
                                再生
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}