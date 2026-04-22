import { HTMLAttributes } from 'react';
import styles from './Container.module.css';

type ContainerProps = HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  const classes = className
    ? `${styles.container} ${className}`
    : styles.container;

  return <div className={classes} {...props} />;
}
