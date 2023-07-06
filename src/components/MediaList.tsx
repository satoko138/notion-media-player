import React, { useRef, useCallback, useState } from 'react';
import { GetMediaListResult, GetMediaPathResult, MediaInfo } from '../types/api-types';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import styles from './MediaList.module.scss';
import Spinner from './Spinner';
import ConfirmDialog, { ConfirmParam } from './ConfirmDialog';
import { useWatch } from '../util/useWatch';
import { useMounted } from '../util/useMounted';

type Props = {
}
export default function MediaList(props: Props) {
    const loadingRef = useRef(false);
    const [ loading, setLoading ] = useState(false);
    const [ medias, setMedias ] = useState<MediaInfo[]>([]);
    const [ nextCursor, setNextCursor ] = useState<string | undefined>();
    const audioRef = useRef<HTMLAudioElement|null>(null);
    // 再生中のAudioIndex
    const [ currentIndex, setCurrentIndex ] = useState<number | undefined>();

    const [ confirm, setConfirm ] = useState<ConfirmParam|undefined>();

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


    useMounted(() => {
        onNextLoad();
    });

    const onConfirmClose = useCallback(() => {
        setConfirm(undefined);
    }, []);

    const onAudioEnded = useCallback(() => {
        if (!currentIndex) return;
        // 次を再生する
        setCurrentIndex(currentIndex+1);
    }, [currentIndex]);

    /**
     * 再生開始
     */
    useWatch(() => {
        if (!currentIndex) return;
        if (currentIndex >= medias.length) {
            return;
        }

        const playFunc = async() => {
            if (!audioRef.current) {
                console.warn('audio not found');
                return;
            }
            setLoading(true);
            try {
                const id = medias[currentIndex].id;
                const res = await fetch('/api/mediapath?id=' + id);
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                const result = await res.json() as GetMediaPathResult;
                audioRef.current.src = result.path;
                audioRef.current.play();
        
            } catch(e) {
                console.warn(e);
                setConfirm({
                    message: 'メディアファイルのダウンロードに失敗しました。'
                });
    
            } finally {
                setLoading(false);
            }
        }
        playFunc();
    }, [currentIndex]);

    return (
        <>
            <div className={styles.Audio}>
                <audio ref={audioRef} controls onEnded={onAudioEnded}></audio>
            </div>
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
                            {medias.map((media, index) => {
                                return (
                                    <tr key={media.id}
                                        className={index===currentIndex ? styles.Current : ''}>
                                        <td>
                                            {media.publish_date}
                                        </td>
                                        <td>
                                            {media.title}
                                        </td>
                                        <td>
                                            <span className={styles.PlayBtn} onClick={()=> setCurrentIndex(index)}>
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
            <ConfirmDialog show={confirm!==undefined} {...confirm} onClose={onConfirmClose} />
        </>
    );
}