import React, { useCallback, useEffect, useState } from 'react';
import { GetMediaListResult, MediaInfo } from '../types/api-types';
import { defaultButton } from '../styles/define';

type Props = {
}
export default function MediaList(props: Props) {
    const [ loading, setLoading ] = useState(false);
    const [ medias, setMedias ] = useState<MediaInfo[]>([]);
    const [ nextCursor, setNextCursor ] = useState<string | undefined>();

    const onNextLoad = useCallback(async() => {
        setLoading(true);

        const param = nextCursor ? '?cursor=' + nextCursor : '';
        const res = await fetch('/api/list' + param);
        const result = await res.json() as GetMediaListResult;
        setMedias((state) => {
            return state.concat(result.medias);
        });
        setNextCursor(result.next_cursor);

        setLoading(false);
    }, [nextCursor]);


    // useEfectじゃない方が適切かもしれないけれど、ひとまず
    useEffect(() => {
        onNextLoad();
    }, []);

    return (
        <>
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
            {loading ?
                <span>Loading...</span>
                : nextCursor &&
                    <button className={defaultButton} onClick={onNextLoad}>続き</button>
            }
        </>
    );
}