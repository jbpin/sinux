import { Store } from './store';

export interface ComputedValue<R> {
  get(): R;
  subscribe(cb: () => void): () => void;
}

export function computed<T, R>(
  store: Store<T>,
  deriveFn: (state: T) => R
): ComputedValue<R> {
  let cachedValue = deriveFn(store.getState());
  const listeners = new Set<() => void>();

  store.subscribe(() => {
    const next = deriveFn(store.getState());
    if (!Object.is(next, cachedValue)) {
      cachedValue = next;
      listeners.forEach(cb => cb());
    }
  });

  return {
    get: () => cachedValue,
    subscribe: (cb) => {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    }
  };
}

export function computedFrom<R>(
  stores: Store<any>[],
  deriveFn: (...states: any[]) => R
): ComputedValue<R> {
  const getStates = () => stores.map(s => s.getState());
  let cachedValue = deriveFn(...getStates());
  const listeners = new Set<() => void>();

  const onChange = () => {
    const next = deriveFn(...getStates());
    if (!Object.is(next, cachedValue)) {
      cachedValue = next;
      listeners.forEach(cb => cb());
    }
  };

  stores.forEach(s => s.subscribe(onChange));

  return {
    get: () => cachedValue,
    subscribe: (cb) => {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    }
  };
}
