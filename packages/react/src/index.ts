import { Store } from '@sinuxjs/core';
import { CombinedStore } from './types';
export type { CombinedStore, CombineStates, ExtractStoreTypesFromArray } from './types';

export { useStore, useStores } from './useStore';
export { useComputed } from './useComputed';

export function combine<T extends Store<any>[]>(
  ...stores: T
): CombinedStore<T> {
  let value = stores.slice(1).reduce((acc, s) => ({ ...acc, ...s.getState() }), stores[0].getState());
  return {
    get state() { return value; },
    snapshot: () => value,
    subscribe: (cb) => {
      const unsubs = stores.map(s => s.subscribe(() => {
        value = stores.reduce((acc, store) => ({ ...acc, ...store.getState() }), {} as any);
        cb();
      }));
      return () => unsubs.forEach(fn => fn());
    },
  };
}
