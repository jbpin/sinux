import { createStore as coreCreateStore, Store } from '@sinuxjs/core';
import { CombinedStore, ExtractStoreTypesFromArray } from './types';

export { useStore, useStores } from './useStore';

export function combine<T extends Store<any>[]>(
  ...stores: T
): CombinedStore<T> {
  let value = stores.slice(1).reduce((acc, s) => ({ ...acc, ...s.getState() }), stores[0].getState());
  return {
    state: value,
    snapshot: () => value,
    subscribe: (cb) => {
      const onChanged = (state) => {
        value = { ...value, ...state };
        cb();
      };
      stores.forEach((s) => s.changed.add(onChanged));
      return () => {
        stores.forEach((s) => s.changed.remove(onChanged));
      };
    },
  };
}
