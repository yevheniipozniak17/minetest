import styles from '../Server.module.css';

export type ServerInfoCardProps = {
  title: string;
  text: string;
};

export function ServerInfoCard({ title, text }: ServerInfoCardProps) {
  return (
    <div className={styles.infoCard}>
      <h3 className={styles.infoCardTitle}>{title}</h3>
      <p className={styles.infoCardText}>{text}</p>
    </div>
  );
}
