'use client';

import Image from 'next/image';

import { NAV_LINKS } from '@/lib/constants';

import styles from './MobileMenu.module.css';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label="Close menu overlay"
        onClick={onClose}
      />
      <aside className={styles.panel} aria-label="Mobile navigation">
        <div className={styles.header}>
          <span className={styles.brand}>
            <Image src="/icons/logo-mark.svg" alt="" width={22} height={22} />
          </span>
          <button type="button" className={styles.close} aria-label="Close menu" onClick={onClose}>
            <Image src="/icons/x.svg" alt="" width={22} height={22} />
          </button>
        </div>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles.link} onClick={onClose}>
              {link.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
