'use client';

import Image from 'next/image';
import { useState } from 'react';

import { FOOTER_BRAND_LINKS, FOOTER_QUICK_LINKS } from '@/lib/constants';

import styles from './Footer.module.css';

const PAYMENT_BADGES = ['GPay', 'MC', 'PayPal', 'Amex', 'Apple', 'Shop'];

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  function toggleSection(id: string) {
    setOpenSection((current) => (current === id ? null : id));
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.topLeft}>
            <h2 className={styles.heading}>Be the first to know</h2>
            <p className={styles.copy}>Sign up for updates from mettā muse.</p>
            <form
              className={styles.newsletter}
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label className="srOnly" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                className={styles.email}
                type="email"
                name="email"
                placeholder="Enter your e-mail..."
                autoComplete="email"
              />
              <button type="submit" className={styles.subscribe}>
                Subscribe
              </button>
            </form>
          </div>

          <div className={styles.metaBlock}>
            <div>
              <h2 className={styles.heading}>Contact us</h2>
              <p className={styles.metaText}>+44 221 133 5360</p>
              <p className={styles.metaText}>customercare@mettamuse.com</p>
            </div>
            <div>
              <h2 className={styles.heading}>Currency</h2>
              <div className={styles.currency}>
                <span className={styles.flag} aria-hidden="true" />
                USD
              </div>
              <p className={styles.metaText}>
                Transactions will be completed in Euros and a currency reference is available on
                hover.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.middle}>
          <div className={styles.column}>
            <button
              type="button"
              className={styles.accordionTrigger}
              aria-expanded={openSection === 'brand'}
              onClick={() => toggleSection('brand')}
            >
              mettā muse
              <Image
                className={styles.lightIcon}
                src="/icons/chevron-down.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
            <h3 className={styles.columnTitle}>mettā muse</h3>
            <div
              className={`${styles.columnBody} ${openSection === 'brand' ? styles.columnBodyOpen : ''}`}
            >
              <ul className={styles.links}>
                {FOOTER_BRAND_LINKS.map((label) => (
                  <li key={label}>
                    <a href="#" className={styles.link}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.column}>
            <button
              type="button"
              className={styles.accordionTrigger}
              aria-expanded={openSection === 'quick'}
              onClick={() => toggleSection('quick')}
            >
              Quick links
              <Image
                className={styles.lightIcon}
                src="/icons/chevron-down.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
            <h3 className={styles.columnTitle}>Quick links</h3>
            <div
              className={`${styles.columnBody} ${openSection === 'quick' ? styles.columnBodyOpen : ''}`}
            >
              <ul className={styles.links}>
                {FOOTER_QUICK_LINKS.map((label) => (
                  <li key={label}>
                    <a href="#" className={styles.link}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${styles.column} ${styles.socialColumn}`}>
            <h3 className={styles.columnTitle}>Follow us</h3>
            <div className={styles.columnBody}>
              <div className={styles.social}>
                <a href="#" aria-label="Instagram">
                  <Image
                    className={styles.lightIcon}
                    src="/icons/instagram.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </a>
                <a href="#" aria-label="LinkedIn">
                  <Image
                    className={styles.lightIcon}
                    src="/icons/linkedin.svg"
                    alt=""
                    width={20}
                    height={20}
                  />
                </a>
              </div>
              <p className={styles.paymentsLabel}>mettā muse accepts</p>
              <div className={styles.payments}>
                {PAYMENT_BADGES.map((badge) => (
                  <span key={badge} className={styles.badge}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className={styles.copyright}>
          Copyright © {new Date().getFullYear()} mettamuse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
