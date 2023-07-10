import React, { useRef, useCallback, useState } from 'react';
import { GetMediaListResult, GetMediaPathResult, MediaInfo } from '../types/api-types';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import styles from './MediaList.module.scss';
import Spinner from './Spinner';
import ConfirmDialog, { ConfirmParam } from './ConfirmDialog';
import { useWatch } from '../util/useWatch';
import Button from './Button';
import { Condition } from '../types/common';

type Props = {
    condition?: Condition;
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

    useWatch(() => {
        console.log('condition', props.condition);
        // 条件変更時は一覧リセットして検索
        setMedias([]);
        setNextCursor(undefined);

        onLoad();
    }, [props.condition]);

    const onLoad = useCallback(async(cursor?: string) => {
        if (loadingRef.current) {
            // 二重ロード禁止
            console.log('二重ロード禁止')
            return;
        }
        console.log('load start');
        loadingRef.current = true;
        setLoading(true);

        const paramMap = {} as {[key: string]: string};
        if (cursor) {
            paramMap['cursor'] = cursor;
        }
        if (props.condition) {
            paramMap['keyword'] = props.condition.keyword;
        }
        const param = Object.entries(paramMap).map(entry => {
            return entry[0] + '=' + entry[1]
        }).join('&');
        const url = '/api/list' + (param.length > 0 ? `?${param}` : '');
        const res = await fetch(encodeURI(url));
        const result = await res.json() as GetMediaListResult;
        setMedias((state) => {
            return state.concat(result.medias);
        });
        setNextCursor(result.next_cursor);

        setLoading(false);
        loadingRef.current = false;
    }, [props.condition]);

    const onConfirmClose = useCallback(() => {
        setConfirm(undefined);
    }, []);

    /**
     * 再生開始
     */
    useWatch(() => {
        if (currentIndex===undefined) return;
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

                const endFunc = () => {
                    setCurrentIndex(currentIndex+1);
                    audioRef.current?.removeEventListener('ended', endFunc);
                }
                audioRef.current.addEventListener('ended', endFunc);
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
        <div className={styles.Container}>
            <div className={styles.Audio}>
                <audio ref={audioRef} controls></audio>
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
                        <div className={styles.NextButtonArea}>
                            <Button type='outline-primary' onClick={()=>onLoad(nextCursor)}>続き</Button>
                        </div>
                    }
                </div>
            </div>
            <ConfirmDialog show={confirm!==undefined} {...confirm} onClose={onConfirmClose} />
        </div>
    );
}