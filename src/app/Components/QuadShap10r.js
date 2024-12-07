// src/app/Components/QuadShap10r.js
import React, { forwardRef } from 'react';
import DiamanteGame from './DiamanteGame';
import styles from './QuadShap10r.module.css';

const QuadShap10r = forwardRef((props, ref) => {
  return (
    <div className={styles.container}>
      <div className={styles.gameWrapper}>
        <div className={styles.gameBoard}>
          <DiamanteGame {...props} boardId="1" />
          <DiamanteGame {...props} boardId="2" />
          <DiamanteGame {...props} boardId="3" />
          <DiamanteGame {...props} boardId="4" />
        </div>
      </div>
    </div>
  );
});

QuadShap10r.displayName = 'QuadShap10r';

export default QuadShap10r;