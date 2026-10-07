import styles from './AnnouncementBar.module.css';

export function AnnouncementBar() {
  return (
    <div className={styles.bar} role="note">
      <span className={styles.item}>Lorem ipsum dolor</span>
      <span className={styles.item}>Lorem ipsum dolor</span>
      <span className={styles.item}>Lorem ipsum dolor</span>
    </div>
  );
}
