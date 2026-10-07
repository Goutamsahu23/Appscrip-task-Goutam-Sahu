'use client';

import { useEffect } from 'react';

import styles from './error.module.css';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.main}>
      <div className={styles.panel} role="alert">
        <p className={styles.eyebrow}>Something went wrong</p>
        <h1 className={styles.title}>Unable to load products</h1>
        <p className={styles.message}>
          The shop could not reach the product API. Check that the backend is running, then try
          again.
        </p>
        <button type="button" className={styles.button} onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
