import React from 'react'
import styles from './Button.module.css'; 

const Button = ({handleClick, children, type, testId, isDisabled }) => {
   return  <button data-testid={testId} onClick={handleClick} className={`${styles.btn} ${type === "reset" ? styles.reset : styles.counter}`} disabled={isDisabled}><span>{children}</span></button>;
}

export default Button;