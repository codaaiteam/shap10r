// src/app/Components/OctoShap10r.js
import React, { forwardRef } from 'react';
import DiamanteGame from './DiamanteGame';
import styles from './OctoShap10r.module.css';

const OctoShap10r = forwardRef((props, ref) => {
  return (
    <div className={styles.container}>
      <div className={styles.gameWrapper}>
        <div className={styles.gameBoard}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((boardId) => (
            <DiamanteGame key={boardId} {...props} boardId={boardId.toString()} />
          ))}
        </div>
      </div>
    </div>
  );
});

OctoShap10r.displayName = 'OctoShap10r';

export default OctoShap10r;
