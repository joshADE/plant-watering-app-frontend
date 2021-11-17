import React from 'react';
import styles from './ErrorNotice.module.css';

interface ErrorNoticeProps {
    message: string;
    clearError: () => void;
}

const ErrorNotice: React.FC<ErrorNoticeProps> = ({
    message,
    clearError,
}) => {
        return (
        <div className={styles["error-notice"]}>
            <span>{message}</span>
            <button onClick={clearError}>X</button> 
        </div>
     );
}

export default ErrorNotice;