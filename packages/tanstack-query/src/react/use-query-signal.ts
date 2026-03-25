import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { Store } from '@sinuxjs/core';

export function useQuerySignal<T, U = T>(
  store: Store<T> & Record<string, any>,
  signalName: string,
  args?: any[],
  selector?: (state: T) => U
): U {
  const calledRef = useRef(false);
  const argsRef = useRef(args);

  // Re-fetch if args change
  const argsChanged = JSON.stringify(args) !== JSON.stringify(argsRef.current);
  if (argsChanged) {
    argsRef.current = args;
    calledRef.current = false;
  }

  useEffect(() => {
    if (!calledRef.current && typeof store[signalName] === 'function') {
      calledRef.current = true;
      store[signalName](...(args || []));
    }
  }, [store, signalName, argsChanged]);

  const getSnapshot = () => {
    const state = store.state;
    return selector ? selector(state) : (state as any as U);
  };

  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
