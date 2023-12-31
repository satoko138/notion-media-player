import React, { useState, useCallback } from 'react';
import Button from './Button';
import styles from './ConditionForm.module.scss';
import { Condition } from '../types/common';

type Props = {
    onChange?: (condition: Condition | undefined) => void;
}

export default function ConditionForm(props: Props) {
    const [ keyword, setKeyword ] = useState('');
    const [ url, setUrl ] = useState('');

    const onSearch = useCallback(() => {
        if (!props.onChange) return;
        const condition: Condition | undefined = (keyword.length === 0) ? undefined : {keyword};
        props.onChange(condition);

        if (condition) {
            const url = `${document.location.protocol}//${document.location.host}?keyword=${keyword}`;
            setUrl(encodeURI(url));

        } else {
            setUrl('');
        }
    }, [props, keyword]);

    const onClear = useCallback(() => {
        setKeyword('');
        if (props.onChange) {
            props.onChange(undefined);
        }
    }, [props]);

    const [ showCopied, setShowCopied ] = useState(false);
    const onCopyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => {
            setShowCopied(false);
        }, 1000);
    }, [url]);

    return (
        <div className={styles.Container}>
            <div className={styles.ConditionForm}>
                <input type='text' className={styles.Input}
                    value={keyword} onChange={(evt) => setKeyword(evt.target.value)} />
                <Button type='primary' onClick={onSearch}>絞り込み</Button>
                <Button type='outline-primary' onClick={onClear}>クリア</Button>
            </div>
            <div className={styles.UrlArea}>
                <label>
                    URL
                    <input type='text' readOnly className={styles.Input} value={url} />
                </label>
                {showCopied ?
                    <span>Copied</span>
                    :
                    <Button type='outline-primary' onClick={onCopyToClipboard}>Copy</Button>
                }
            </div>
        </div>
    );
}