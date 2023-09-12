import { Store } from '@sinuxjs/core';

export type TupleToIntersection<T> = (T extends any ? (k: T) => void : never) extends (k: infer I) => void ? I : never;
export type ExtractStoreType<S> = S extends Store<infer T> ? T : never;

export type CombineStates<S extends Store<any>[]> = TupleToIntersection<{
  [K in keyof S]: ExtractStoreType<S[K]>;
}[number]>;

export type ExtractStoreTypesFromArray<S extends Store<any> | Store<any>[]> = S extends Store<any> ? ExtractStoreType<S> : S extends Store<any>[] ? CombineStates<S> : never;

export type CombinedStore<T extends Store<any>[]> = {
  state: CombineStates<T>
  snapshot: () => any;
  subscribe: (cb) => any;
};