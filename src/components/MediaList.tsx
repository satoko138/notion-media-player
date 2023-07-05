import React, { useCallback, useEffect, useState } from 'react';
import { GetMediaListResult, MediaInfo } from '../types/api-types';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import styles from './MediaList.module.scss';

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
            <table className={styles.Table}>
                <thead>
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
                                    <BsFillPlayCircleFill />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            {loading ?
                <span>Loading...</span>
                : nextCursor &&
                    <button onClick={onNextLoad}>続き</button>
            }
        </>
    );
}