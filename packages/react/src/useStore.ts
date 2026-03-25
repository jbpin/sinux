import * as useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
import { CombinedStore, ExtractStoreTypesFromArray } from './types';
import { Store } from '@sinuxjs/core';

export function useStore<T extends Store<any>, U extends Partial<ExtractStoreTypesFromArray<T>>>(
  store: T,
  selector?: (state: ExtractStoreTypesFromArray<T>) => U,
  equalityFn?: (a: U, b: U) => boolean
): U {
  const load = () => {};
  const snapshot = () => store.state;
  selector = selector ? selector : (state: typeof store.state) => state as any
  return useSyncExternalStoreWithSelector(store.subscribe, snapshot, load, selector, equalityFn) as U;
}


export function useStores<T extends Store<any>[], U extends Partial<ExtractStoreTypesFromArray<T>>> (
  combinedStore: CombinedStore<T>,
  selector?: (state: typeof combinedStore.state) => U,
  equalityFn?: (a: U, b: U) => boolean
): U {
  const load = () => {};
  selector = selector ? selector : (state: typeof combinedStore.state) => state as any
  return useSyncExternalStoreWithSelector(combinedStore.subscribe, combinedStore.snapshot, load, selector, equalityFn) as U;
};
