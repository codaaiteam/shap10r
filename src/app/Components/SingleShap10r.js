import React from 'react';
import styles from './SingleShap10r.module.css';

export default function SingleShap10r({ isFullscreen }) {
  return (
    <div className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.game}>
        <div className={styles.shape}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="25" width="50" height="50" className={styles.mainShape} rx="10" />
            <path 
              d="M40 40 L60 40 L60 60 L40 60 Z" 
              className={styles.innerShape}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="50" r="3" className={styles.centerDot} />
          </svg>
        </div>
      </div>
    </div>
  );
}
