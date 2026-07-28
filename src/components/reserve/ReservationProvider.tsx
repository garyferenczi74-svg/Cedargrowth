'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

// The shared reservations bag. This holds an intent to reserve, it is not a
// cart and it does not sell. No price, no payment, no inventory count is stored
// or shown, because none of that is confirmed. Persisted to localStorage so the
// bag survives navigation.

export type ReservationItem = {
  slug: string;
  name: string;
  spec: string;
  qty: number;
};

type ReservationCtx = {
  items: ReservationItem[];
  count: number;
  hydrated: boolean;
  add: (item: Omit<ReservationItem, 'qty'>) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Context = createContext<ReservationCtx | null>(null);
const STORAGE_KEY = 'cedargrowth-reservations-v1';

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as ReservationItem[]);
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage write failures
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<ReservationItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === item.slug ? { ...i, qty: i.qty + 1 } : i,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, i) => n + i.qty, 0);

  return (
    <Context.Provider
      value={{ items, count, hydrated, add, setQty, remove, clear }}
    >
      {children}
    </Context.Provider>
  );
}

export function useReservation() {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return ctx;
}
