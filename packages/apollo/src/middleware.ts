import type { ApolloClient } from '@apollo/client';
import type { MiddlewareConfig, Store } from '@sinuxjs/core';
import { GRAPHQL_QUERY, GRAPHQL_MUTATION, ApolloClientOptions, GraphQLQueryOptions, GraphQLMutationOptions } from './types';
import { setupCacheSync } from './cache-sync';

export function apolloClient<T>(options: ApolloClientOptions): MiddlewareConfig<T> {
  let client: ApolloClient<any>;
  let storeRef: Store<T>;
  let syncCount = 0;
  const cleanups: (() => void)[] = [];

  const resolveClient = (): ApolloClient<any> => {
    if (client) return client;
    client = typeof options.client === 'function'
      ? options.client()
      : options.client;
    return client;
  };

  const isSyncing = () => syncCount > 0;
  const startSync = () => { syncCount++; };
  const endSync = () => { syncCount--; };

  return {
    onInit(store) {
      storeRef = store;
      const ac = resolveClient();

      // Scan signals for GRAPHQL_QUERY metadata to set up cache sync
      for (const key of Object.keys(store)) {
        const prop = (store as any)[key];
        if (typeof prop !== 'function' || !prop.__proto__) continue;

        const signal = prop.__proto__;
        if (!signal.commands) continue;

        for (const command of signal.commands) {
          const queryMeta = command[GRAPHQL_QUERY] as GraphQLQueryOptions<T> | undefined;
          if (queryMeta && queryMeta.variables && typeof queryMeta.variables !== 'function') {
            const cleanup = setupCacheSync(
              ac, store, queryMeta, queryMeta.variables,
              isSyncing, startSync, endSync
            );
            cleanups.push(cleanup);
          }
        }
      }
    },

    onDispatch({ args, getState, signal, next }) {
      const handler = signal.commands.values().next().value;
      if (!handler) return next(getState(), ...args);

      const queryMeta = handler[GRAPHQL_QUERY] as GraphQLQueryOptions<T> | undefined;
      const mutationMeta = handler[GRAPHQL_MUTATION] as GraphQLMutationOptions<T> | undefined;

      if (queryMeta) {
        return handleQueryDispatch(resolveClient(), storeRef, getState, args, queryMeta, startSync, endSync);
      }

      if (mutationMeta) {
        return handleMutationDispatch(resolveClient(), storeRef, getState, args, mutationMeta, startSync, endSync);
      }

      return next(getState(), ...args);
    },
  };
}

async function handleQueryDispatch<T>(
  client: ApolloClient<any>,
  store: Store<T>,
  getState: () => T,
  args: any[],
  meta: GraphQLQueryOptions<T>,
  startSync: () => void,
  endSync: () => void
): Promise<Partial<T>> {
  // Apply pre-fetch state
  if (meta.onFetch) {
    startSync();
    store.updateState(meta.onFetch(getState(), ...args));
    endSync();
  }

  const variables = typeof meta.variables === 'function'
    ? (meta.variables as Function)(...args)
    : (args[0] ?? meta.variables);

  try {
    const { data } = await client.query({
      query: meta.query,
      variables,
      fetchPolicy: (meta.fetchPolicy || 'network-only') as any,
    });

    return meta.mapToState(data, getState());
  } catch (error) {
    if (meta.onError) {
      return meta.onError(error, getState(), ...args);
    }
    throw error;
  }
}

async function handleMutationDispatch<T>(
  client: ApolloClient<any>,
  store: Store<T>,
  getState: () => T,
  args: any[],
  meta: GraphQLMutationOptions<T>,
  startSync: () => void,
  endSync: () => void
): Promise<Partial<T>> {
  const prevState = getState();

  const variables = typeof meta.variables === 'function'
    ? (meta.variables as Function)(...args)
    : (args[0] ?? meta.variables);

  const optimisticResponse = typeof meta.optimisticResponse === 'function'
    ? (meta.optimisticResponse as Function)(...args)
    : meta.optimisticResponse;

  // Apply optimistic store update
  if (meta.optimistic) {
    startSync();
    store.updateState(meta.optimistic(prevState, ...args));
    endSync();
  }

  try {
    const { data } = await client.mutate({
      mutation: meta.mutation,
      variables,
      optimisticResponse,
      update: meta.update,
      refetchQueries: meta.refetchQueries?.map(query => ({ query })),
    });

    return meta.mapToState(data, getState());
  } catch (error) {
    // Rollback store on error
    if (meta.optimistic) {
      startSync();
      store.updateState(prevState);
      endSync();
    }

    if (meta.onError) {
      const errorUpdate = meta.onError(error, prevState, ...args);
      if (errorUpdate) return errorUpdate;
    }
    throw error;
  }
}
