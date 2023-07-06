import React from 'react';
import styles from './Spinner.module.scss';

type Props = {
    size?: 'normal' | 'small'
}
export default function Spinner(props: Props) {
    return (
        <div className={styles.DotPulse}>
            <div className={styles.DotPulseDot}></div>
        </div>
    );
}