'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useRef, useState } from 'react';

import { NAV_LINKS } from '@/lib/constants';

import styles from './Header.module.css';
import { HeaderSearch } from './HeaderSearch';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.left}>
            <button
              ref={menuButtonRef}
              type="button"
              className={styles.menuButton}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <Image src="/icons/menu.svg" alt="" width={22} height={22} />
            </button>
            <Image src="/icons/logo-mark.svg" alt="" width={26} height={26} />
          </div>

          <Link href="/" className={styles.brand}>
            LOGO
          </Link>

          <div className={styles.actions}>
            <Suspense
              fallback={
                <button type="button" className={styles.iconButton} aria-label="Search">
                  <Image src="/icons/search.svg" alt="" width={20} height={20} />
                </button>
              }
            >
              <HeaderSearch />
            </Suspense>
            <button type="button" className={styles.iconButton} aria-label="Wishlist">
              <Image src="/icons/heart.svg" alt="" width={20} height={20} />
            </button>
            <button type="button" className={styles.iconButton} aria-label="Cart">
              <Image src="/icons/shopping-bag.svg" alt="" width={20} height={20} />
            </button>
            <button
              type="button"
              className={`${styles.iconButton} ${styles.profile}`}
              aria-label="Profile"
            >
              <Image src="/icons/user.svg" alt="" width={20} height={20} />
            </button>
            <button type="button" className={styles.lang} aria-label="Language">
              ENG
              <Image src="/icons/chevron-down.svg" alt="" width={14} height={14} />
            </button>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
