// src/app/Components/DoubleShapr10r.js
import React, { useState } from 'react';
import DiamanteGame from './DiamanteGame';
import GamesHelpDialog from './GamesHelpDialog';
import { useTranslations } from '@/hooks/useTranslations';
import styles from './DoubleShapr10r.module.css';

const DoubleShapr10r = (props) => {
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const { t } = useTranslations();

  return (
    <div className={styles.doubleGameContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>DoubleShapr10r</h2>
        <button
          className={styles.helpButton}
          onClick={() => setShowHelpDialog(true)}
          aria-label={t.common.game.help}
        >
          ?
        </button>
      </div>
      <div className={styles.gameBoard}>
        <DiamanteGame {...props} boardId="1" hideHelp={true} />
        <DiamanteGame {...props} boardId="2" hideHelp={true} />
      </div>
      {showHelpDialog && (
        <GamesHelpDialog
          t={t}
          onClose={() => setShowHelpDialog(false)}
        />
      )}
    </div>
  );
};

export default DoubleShapr10r;