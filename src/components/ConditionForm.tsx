import React, { useState, useCallback } from 'react';
import Button from './Button';
import styles from './ConditionForm.module.scss';
import { Condition } from '../types/api-types';

type Props = {
    onChange?: (condition: Condition | undefined) => void;
}

export default function ConditionForm(props: Props) {
    const [ keyword, setKeyword ] = useState('');

    const onSearch = useCallback(() => {
        if (!props.onChange) return;
        const condition: Condition | undefined = (keyword.length === 0) ? undefined : {keyword};
        props.onChange(condition)
    }, [props, keyword]);

    return (
        <form>
            <input type='text' className={styles.Input}
                value={keyword} onChange={(evt) => setKeyword(evt.target.value)} />
            <Button onClick={onSearch}>絞り込み</Button>
        </form>
    );
}