// src/app/Components/DoubleShapr10r.js
import React from 'react';
import DiamanteGame from './DiamanteGame';
import styles from './DoubleShapr10r.module.css';

const DoubleShapr10r = (props) => {
 return (
   <div className={styles.doubleGameContainer}>
     <div className={styles.gameBoard}>
       <DiamanteGame {...props} boardId="1" />
       <DiamanteGame {...props} boardId="2" />
     </div>

   </div>
 );
};

export default DoubleShapr10r;