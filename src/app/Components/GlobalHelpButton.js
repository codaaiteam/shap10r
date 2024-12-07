import React from 'react';
import styles from './GlobalHelpButton.module.css';
import GamesHelpDialog from './GamesHelpDialog';

const GlobalHelpButton = ({ t }) => {
  const [showHelpDialog, setShowHelpDialog] = React.useState(false);

  return (
    <>
      <button 
        className={styles.helpButton}
        onClick={() => setShowHelpDialog(true)}
        aria-label={t.common.game.help}
      >
        ?
      </button>
      {showHelpDialog && (
        <GamesHelpDialog
          t={t}
          onClose={() => setShowHelpDialog(false)}
        />
      )}
    </>
  );
};

export default GlobalHelpButton;
