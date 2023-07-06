import React, { useRef, useCallback, useEffect, useState } from 'react';
import { GetMediaListResult, GetMediaPathResult, MediaInfo } from '../types/api-types';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import styles from './MediaList.module.scss';
import Spinner from './Spinner';

type Props = {
}
export default function MediaList(props: Props) {
    const loadingRef = useRef(false);
    const [ loading, setLoading ] = useState(false);
    const [ medias, setMedias ] = useState<MediaInfo[]>([]);
    const [ nextCursor, setNextCursor ] = useState<string | undefined>();
    const [ audioSrc, setAudioSrc ] = useState<string | undefined>();

    const onNextLoad = useCallback(async() => {
        if (loadingRef.current) {
            // 二重ロード禁止
            console.log('二重ロード禁止')
            return;
        }
        console.log('load start');
        loadingRef.current = true;
        setLoading(true);

        const param = nextCursor ? '?cursor=' + nextCursor : '';
        const res = await fetch('/api/list' + param);
        const result = await res.json() as GetMediaListResult;
        setMedias((state) => {
            return state.concat(result.medias);
        });
        setNextCursor(result.next_cursor);

        setLoading(false);
        loadingRef.current = false;
    }, [nextCursor]);


    // useEfectじゃない方が適切かもしれないけれど、ひとまず
    useEffect(() => {
        onNextLoad();
    }, []);

    const onPlay = useCallback(async(id: string) => {
        const res = await fetch('/api/mediapath?id=' + id);
        const result = await res.json() as GetMediaPathResult;
        console.log('res', result);
        setAudioSrc(result.path);
    }, []);

    return (
        <>
            <audio controls src={audioSrc}></audio>
            <div className={styles.TableArea}>
                {/* <div className={styles.SpinnerOverlay}>
                    <Spinner />
                </div> */}
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
                                        <span className={styles.PlayBtn} onClick={()=>onPlay(media.id)}>
                                            <BsFillPlayCircleFill />
                                        </span>
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
            </div>
        </>
    );
}