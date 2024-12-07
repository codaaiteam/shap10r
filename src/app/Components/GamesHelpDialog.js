import React from 'react';
import styles from './GamesHelpDialog.module.css';

// Help Dialog Component
const GamesHelpDialog = ({ t, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{t.common.game.help}</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <div className={styles.modalContent}>
          <section>
            <h3>{t.common.game.gameDescription}</h3>
            <p>{t.common.game.gameDesc}</p>
          </section>

          <section>
            <h3>{t.common.game.objective}</h3>
            <p>{t.common.game.objectiveDesc}</p>
          </section>

          <section>
            <h3>{t.common.game.basicRules}</h3>
            <ul>
              <li>{t.common.game.rule1}</li>
              <li>{t.common.game.rule2}</li>
              <li>{t.common.game.rule3}</li>
            </ul>
          </section>

          <section>
            <h3>{t.common.game.howToPlay}</h3>
            <ul>
              <li>{t.common.game.step1}</li>
              <li>{t.common.game.step2}</li>
              <li>{t.common.game.step3}</li>
            </ul>
          </section>

          <section>
            <h3>{t.common.game.controls}</h3>
            <ul>
              <li>{t.common.game.controlsDesc1}</li>
              <li>{t.common.game.controlsDesc2}</li>
              <li>{t.common.game.controlsDesc3}</li>
            </ul>
          </section>

          <section>
            <h3>{t.common.game.scoring}</h3>
            <p>{t.common.game.scoringDesc}</p>
          </section>

          <section>
            <h3>{t.common.game.tips}</h3>
            <ul>
              <li>{t.common.game.tip1}</li>
              <li>{t.common.game.tip2}</li>
              <li>{t.common.game.tip3}</li>
              <li>{t.common.game.tip4}</li>
            </ul>
          </section>

          <section>
            <h3>{t.common.game.variations}</h3>
            <p>{t.common.game.variationsDesc}</p>
          </section>

          <div className={styles.modalFooter}>
            <button onClick={onClose} className={styles.closeModalButton}>
              {t.common.game.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesHelpDialog;
