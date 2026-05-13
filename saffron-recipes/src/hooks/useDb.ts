import { useEffect, useState } from 'react';
import { db } from '../lib/db';

// Fire the API load as soon as this module is imported (i.e. immediately on app boot).
db.init();

export function useDb() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Ensure init kicks off (idempotent)
    db.init();
    const unsubscribe = db.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return db;
}

/**
 * Returns the db loading state for components that want to show a loader
 * while the very first fetch is in flight.
 */
export function useDbStatus() {
  const [, setTick] = useState(0);
  useEffect(() => {
    db.init();
    const unsubscribe = db.subscribe(() => setTick((t) => t + 1));
    return unsubscribe;
  }, []);
  return { ready: db.ready, error: db.error };
}