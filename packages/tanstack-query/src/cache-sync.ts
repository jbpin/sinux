import type { QueryClient, QueryKey } from '@tanstack/react-query';
import type { Store } from '@sinuxjs/core';
import type { QuerySignalOptions } from './types';

export function setupCacheSync<T>(
  qc: QueryClient,
  store: Store<T>,
  queryKey: QueryKey,
  meta: QuerySignalOptions<T>,
  isSyncing: () => boolean,
  setSyncing: (v: boolean) => void
): () => void {
  const cache = qc.getQueryCache();
  const keyStr = JSON.stringify(queryKey);

  const unsubscribe = cache.subscribe((event) => {
    if (isSyncing()) return;

    if (
      event.type === 'updated' &&
      event.action.type === 'success' &&
      JSON.stringify(event.query.queryKey) === keyStr
    ) {
      const data = event.query.state.data;
      if (data === undefined) return;

      setSyncing(true);
      const selected = meta.select ? meta.select(data) : data;
      store.updateState(meta.mapToState(selected, store.getState()));
      setSyncing(false);
    }
  });

  return unsubscribe;
}
