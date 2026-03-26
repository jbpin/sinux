import * as useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
import { CombinedStore, CombineStates, ExtractStoreTypesFromArray } from './types';
import { Store } from '@sinuxjs/core';

export function useStore<T extends Store<any>>(
  store: T,
): ExtractStoreTypesFromArray<T>;
export function useStore<T extends Store<any>, U>(
  store: T,
  selector: (state: ExtractStoreTypesFromArray<T>) => U,
  equalityFn?: (a: U, b: U) => boolean
): U;
export function useStore(
  store: Store<any>,
  selector?: (state: any) => any,
  equalityFn?: (a: any, b: any) => boolean
) {
  const load = () => {};
  const snapshot = () => store.state;
  selector = selector ? selector : (state: typeof store.state) => state
  return useSyncExternalStoreWithSelector(store.subscribe, snapshot, load, selector, equalityFn);
}


export function useStores<T extends Store<any>[]>(
  combinedStore: CombinedStore<T>,
): CombineStates<T>;
export function useStores<T extends Store<any>[], U>(
  combinedStore: CombinedStore<T>,
  selector: (state: CombineStates<T>) => U,
  equalityFn?: (a: U, b: U) => boolean
): U;
export function useStores(
  combinedStore: CombinedStore<Store<any>[]>,
  selector?: (state: any) => any,
  equalityFn?: (a: any, b: any) => boolean
) {
  const load = () => {};
  selector = selector ? selector : (state: any) => state
  return useSyncExternalStoreWithSelector(combinedStore.subscribe, combinedStore.snapshot, load, selector, equalityFn);
}
