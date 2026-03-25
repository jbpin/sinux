import type { QueryClient, QueryKey } from '@tanstack/react-query';
import type { MiddlewareConfig, Store } from '@sinuxjs/core';
import { QUERY_SIGNAL, MUTATION_SIGNAL, TanstackQueryOptions, QuerySignalOptions, MutationSignalOptions } from './types';
import { setupCacheSync } from './cache-sync';

export function tanstackQuery<T>(options: TanstackQueryOptions): MiddlewareConfig<T> {
  let client: QueryClient;
  let storeRef: Store<T>;
  let syncCount = 0;
  const cleanups: (() => void)[] = [];

  const resolveClient = (): QueryClient => {
    if (client) return client;
    client = typeof options.queryClient === 'function'
      ? options.queryClient()
      : options.queryClient;
    return client;
  };

  const isSyncing = () => syncCount > 0;
  const startSync = () => { syncCount++; };
  const endSync = () => { syncCount--; };

  return {
    onInit(store) {
      storeRef = store;
      const qc = resolveClient();

      // Scan all store properties for signals with query metadata
      // to set up cache → store subscriptions
      for (const key of Object.keys(store)) {
        const prop = (store as any)[key];
        if (typeof prop !== 'function' || !prop.__proto__) continue;

        const signal = prop.__proto__;
        if (!signal.commands) continue;

        for (const command of signal.commands) {
          const queryMeta = command[QUERY_SIGNAL] as QuerySignalOptions<T> | undefined;
          if (queryMeta && typeof queryMeta.queryKey !== 'function') {
            const cleanup = setupCacheSync(
              qc, store, queryMeta.queryKey as QueryKey, queryMeta, isSyncing, (v) => {
                if (v) startSync(); else endSync();
              }
            );
            cleanups.push(cleanup);
          }
        }
      }
    },

    onDispatch({ signalName, args, getState, signal, next }) {
      // Find the handler with query/mutation metadata
      const handler = signal.commands.values().next().value;
      if (!handler) return next(getState(), ...args);

      const queryMeta = handler[QUERY_SIGNAL] as QuerySignalOptions<T> | undefined;
      const mutationMeta = handler[MUTATION_SIGNAL] as MutationSignalOptions<T> | undefined;

      if (queryMeta) {
        return handleQueryDispatch(resolveClient(), storeRef, getState, args, queryMeta, startSync, endSync);
      }

      if (mutationMeta) {
        return handleMutationDispatch(resolveClient(), storeRef, getState, args, mutationMeta, startSync, endSync);
      }

      // Not a query/mutation signal — pass through
      return next(getState(), ...args);
    },
  };
}

async function handleQueryDispatch<T>(
  qc: QueryClient,
  store: Store<T>,
  getState: () => T,
  args: any[],
  meta: QuerySignalOptions<T>,
  startSync: () => void,
  endSync: () => void
): Promise<Partial<T>> {
  const state = getState();
  const queryKey = typeof meta.queryKey === 'function'
    ? (meta.queryKey as Function)(...args)
    : meta.queryKey;

  // Apply pre-fetch state (e.g. loading: true)
  if (meta.onFetch) {
    startSync();
    store.updateState(meta.onFetch(state, ...args));
    endSync();
  }

  try {
    const data = await qc.fetchQuery({
      queryKey,
      queryFn: () => meta.queryFn(...args),
      staleTime: meta.staleTime,
      gcTime: meta.gcTime,
    });

    const selected = meta.select ? meta.select(data) : data;
    return meta.mapToState(selected, getState());
  } catch (error) {
    if (meta.onError) {
      return meta.onError(error, getState(), ...args);
    }
    throw error;
  }
}

async function handleMutationDispatch<T>(
  qc: QueryClient,
  store: Store<T>,
  getState: () => T,
  args: any[],
  meta: MutationSignalOptions<T>,
  startSync: () => void,
  endSync: () => void
): Promise<Partial<T>> {
  const prevState = getState();

  // Snapshot query cache for rollback
  const cacheSnapshots = new Map<string, unknown>();
  if (meta.invalidates) {
    for (const key of meta.invalidates) {
      cacheSnapshots.set(JSON.stringify(key), qc.getQueryData(key));
    }
  }

  // Optimistic path
  if (meta.optimistic) {
    const optimisticUpdate = meta.optimistic(prevState, ...args);

    // Apply optimistic state immediately
    startSync();
    store.updateState(optimisticUpdate);
    endSync();

    try {
      const data = await meta.mutationFn(...args);
      const finalUpdate = meta.mapToState(data, getState());

      // Invalidate related queries
      if (meta.invalidates) {
        const promises = meta.invalidates.map(key =>
          qc.invalidateQueries({ queryKey: key })
        );
        if (meta.awaitInvalidation) await Promise.all(promises);
      }

      return finalUpdate;
    } catch (error) {
      // Rollback store to pre-optimistic state
      startSync();
      store.updateState(prevState);
      endSync();

      // Rollback query cache
      for (const [keyStr, data] of cacheSnapshots) {
        qc.setQueryData(JSON.parse(keyStr), data);
      }

      if (meta.onError) {
        const errorUpdate = meta.onError(error, prevState, ...args);
        if (errorUpdate) return errorUpdate;
      }
      throw error;
    }
  }

  // Non-optimistic path
  try {
    const data = await meta.mutationFn(...args);

    if (meta.invalidates) {
      const promises = meta.invalidates.map(key =>
        qc.invalidateQueries({ queryKey: key })
      );
      if (meta.awaitInvalidation) await Promise.all(promises);
    }

    return meta.mapToState(data, getState());
  } catch (error) {
    if (meta.onError) {
      const errorUpdate = meta.onError(error, prevState, ...args);
      if (errorUpdate) return errorUpdate;
    }
    throw error;
  }
}
