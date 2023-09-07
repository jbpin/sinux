import { Store, createStore } from '@sinux/core';
import * as useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;

type TupleToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
type ExtractStoreType<S> = S extends Store<infer T> ? T : never;

type CombineStates<S extends Store<any>[]> = TupleToIntersection<{
  [K in keyof S]: ExtractStoreType<S[K]>;
}[number]>;

type ExtractStoreTypesFromArray<S extends Store<any>[] | Store<any>> = S extends Store<any> ? ExtractStoreType<S> : S extends Store<any>[] ? CombineStates<S> : never;

export function useStore<T extends Store<any>[] | Store<any>, U extends Partial<ExtractStoreTypesFromArray<T>>>(
  stores: T,
  selector: (state: ExtractStoreTypesFromArray<T>) => U,
  equalityFn?: (a: ExtractStoreTypesFromArray<T>, b: ExtractStoreTypesFromArray<T>) => boolean
): U {
  const storesArr: Store<T>[] = [].concat(stores);
  let value: ExtractStoreTypesFromArray<T> = storesArr.reduce(
    (acc, s) => ({ ...acc, ...s.getState() }),
    {} as ExtractStoreTypesFromArray<T>
  );

  const subscribe = (cb) => {
    const onChanged = (state) => {
      value = { ...value, ...state };
      cb();
    };
    storesArr.forEach((s) => s.changed.add(onChanged));
    return () => {
      storesArr.forEach((s) => s.changed.remove(onChanged));
    };
  };

  const snapshot = () => value;
  const load = () => storesArr.forEach((s) => s['load']?.());

  return useSyncExternalStoreWithSelector(subscribe, snapshot, load, selector, equalityFn) as U;
}

