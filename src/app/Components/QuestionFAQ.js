import React, { useState } from "react";
import styles from "./questionfaq.module.css";

function QuestionFAQ(props) {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.question}>
      <p onClick={toggleActive}>
        {isActive ? '▼ ' : '► '}{props.question}
      </p>
      <div
        className={`${styles.answer} ${isActive ? styles.active : ""}`}
        style={{
          maxHeight: isActive ? '1000px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out'
        }}
      >
        <p>{props.answer}</p>
      </div>
    </div>
  );
}

export default QuestionFAQ;
