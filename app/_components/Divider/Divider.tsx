import { HTMLAttributes } from 'react';
import styles from './Divider.module.css';

type DividerProps = HTMLAttributes<HTMLHRElement>;

export function Divider({ className, ...props }: DividerProps) {
  const classes = className ? `${styles.divider} ${className}` : styles.divider;

  return <hr className={classes} {...props} />;
}
