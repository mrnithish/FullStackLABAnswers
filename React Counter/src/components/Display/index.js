import React from 'react';
import styles from './Display.module.css'; 

const Display = ({counter, testId}) => {
  return (
    <p className={styles.counter} data-testid={testId}>{counter}</p>
  );
}

export default Display;