import * as useSyncExternalStoreExports from 'use-sync-external-store/shim';
const { useSyncExternalStore } = useSyncExternalStoreExports;
import { ComputedValue } from '@sinuxjs/core';

export function useComputed<R>(computedValue: ComputedValue<R>): R {
  return useSyncExternalStore(computedValue.subscribe, computedValue.get, computedValue.get);
}
