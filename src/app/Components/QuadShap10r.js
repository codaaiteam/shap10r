// src/app/Components/QuadShap10r.js
import React, { forwardRef, useState } from 'react';
import DiamanteGame from './DiamanteGame';
import GamesHelpDialog from './GamesHelpDialog';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './QuadShap10r.module.css';

const QuadShap10r = forwardRef((props, ref) => {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const { t } = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.gameWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>QuadShap10r</h2>
          <button
            className={styles.helpButton}
            onClick={() => setShowHelpDialog(true)}
            aria-label={t?.common?.game?.help || "Help"}
          >
            ?
          </button>
        </div>
        <div className={styles.gameBoard}>
          {[1, 2, 3, 4].map((boardId) => (
            <DiamanteGame 
              key={boardId} 
              {...props} 
              boardId={boardId.toString()} 
              hideHelp={true} 
              isQuad={true}
            />
          ))}
        </div>
      </div>
      {showHelpDialog && (
        <GamesHelpDialog
          t={t}
          onClose={() => setShowHelpDialog(false)}
        />
      )}
    </div>
  );
});

QuadShap10r.displayName = 'QuadShap10r';

export default QuadShap10r;