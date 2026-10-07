'use client';

import {
  createContext,
  useContext,
  useMemo,
  useTransition,
  type ReactNode,
  type TransitionStartFunction,
} from 'react';

type NavigationPendingContextValue = {
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

const NavigationPendingContext = createContext<NavigationPendingContextValue | null>(null);

export function NavigationPendingProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  const value = useMemo(
    () => ({
      isPending,
      startTransition,
    }),
    [isPending, startTransition],
  );

  return (
    <NavigationPendingContext.Provider value={value}>{children}</NavigationPendingContext.Provider>
  );
}

export function useNavigationPending() {
  const context = useContext(NavigationPendingContext);

  if (!context) {
    throw new Error('useNavigationPending must be used within NavigationPendingProvider');
  }

  return context;
}
