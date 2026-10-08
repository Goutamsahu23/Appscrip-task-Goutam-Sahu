import Image from 'next/image';

import styles from './AnnouncementBar.module.css';

const ITEMS = ['Lorem ipsum dolor', 'Lorem ipsum dolor', 'Lorem ipsum dolor'] as const;

export function AnnouncementBar() {
  return (
    <div className={styles.bar} role="note">
      {ITEMS.map((label, index) => (
        <span key={`${label}-${index}`} className={styles.item}>
          <Image
            className={styles.icon}
            src="/icons/grid.svg"
            alt=""
            width={12}
            height={12}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
