'use client';

import Image from 'next/image';
import { useRef, type RefObject } from 'react';

import { NAV_LINKS } from '@/lib/constants';
import { useFocusTrap } from '@/lib/useFocusTrap';

import styles from './MobileMenu.module.css';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const panelRef = useRef<HTMLElement>(null);
  useFocusTrap(panelRef, { open, onClose, restoreFocusRef: triggerRef });

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className={styles.overlay}
        aria-label="Close menu overlay"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        id="mobile-menu"
        ref={panelRef}
        className={styles.panel}
        aria-label="Mobile navigation"
        role="dialog"
        aria-modal="true"
      >
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
