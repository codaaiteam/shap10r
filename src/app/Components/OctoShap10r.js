// src/app/Components/OctoShap10r.js
import React, { forwardRef, useState } from 'react';
import DiamanteGame from './DiamanteGame';
import GamesHelpDialog from './GamesHelpDialog';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './OctoShap10r.module.css';

const OctoShap10r = forwardRef((props, ref) => {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const { t } = useTranslations();

  return (
    <div className={styles.container}>
      <div className={styles.gameWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>OctoShapr10r</h2>
          <button
            className={styles.helpButton}
            onClick={() => setShowHelpDialog(true)}
            aria-label={t.common.game.help}
          >
            ?
          </button>
        </div>
        <div className={styles.gameBoard}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((boardId) => (
            <DiamanteGame key={boardId} {...props} boardId={boardId.toString()} hideHelp={true} />
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

OctoShap10r.displayName = 'OctoShap10r';

export default OctoShap10r;
