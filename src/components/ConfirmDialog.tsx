import React, { useRef, useEffect, useCallback } from 'react';
import styles from './ConfirmDialog.module.scss';

type Props = {
    show: boolean;
    onClose?: () => void;
} & ConfirmParam;

export type ConfirmParam = {
    message?: string;
}
export default function ConfirmDialog(props: Props) {
    const myRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!myRef.current) return;
        if (props.show) {
            if (!myRef.current.open) {
                myRef.current?.showModal();
            }
        } else {
            myRef.current?.close();
        }
    }, [props.show])

    const onClose = useCallback(() => {
        if (!myRef.current) return;
        myRef.current.close();
        if (props.onClose)
            props.onClose();

    }, [])

    return (
        <dialog ref={myRef} className={styles.Dialog}>
            <div className={styles.Header}>
                <span className={styles.Close} onClick={onClose}>×</span>
            </div>
            <div className={styles.Body}>
                {props.message ?? ''}
            </div>
        </dialog>
    );
}