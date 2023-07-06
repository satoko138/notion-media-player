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
        setLoading(true);
        const res = await fetch('/api/mediapath?id=' + id);
        const result = await res.json() as GetMediaPathResult;
        console.log('res', result);
        setAudioSrc(result.path);
        setLoading(false);
    }, []);

    return (
        <>
            <audio controls src={audioSrc}></audio>
            <div className={styles.Container}>
                {loading &&
                    <div className={styles.SpinnerOverlay}>
                        <Spinner />
                    </div>
                }
                <div className={styles.TableArea}>
                    <table className={styles.Table}>
                        <thead>
                            <tr>
                                <th>
                                    配信日
                                </th>
                                <th className={styles.Title}>
                                    タイトル
                                </th>
                                <th>
                                    再生
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {medias.map(media => {
                                return (
                                    <tr key={media.id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                                        <td>
                                            {media.publish_date}
                                        </td>
                                        <td>
                                            {media.title}
                                        </td>
                                        <td>
                                            <span className={styles.PlayBtn} onClick={()=>onPlay(media.id)}>
                                                <BsFillPlayCircleFill />
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {nextCursor &&
                        <button className={styles.Button} onClick={onNextLoad}>続き</button>
                    }
                </div>
            </div>
        </>
    );
}