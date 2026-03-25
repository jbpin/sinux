import type { ApolloClient } from '@apollo/client';
import type { Store } from '@sinuxjs/core';
import type { GraphQLQueryOptions } from './types';

export function setupCacheSync<T>(
  client: ApolloClient<any>,
  store: Store<T>,
  meta: GraphQLQueryOptions<T>,
  variables: any,
  isSyncing: () => boolean,
  startSync: () => void,
  endSync: () => void
): () => void {
  const observable = client.watchQuery({
    query: meta.query,
    variables,
    fetchPolicy: meta.fetchPolicy || 'cache-first',
  });

  const subscription = observable.subscribe({
    next({ data }) {
      if (isSyncing() || !data) return;

      startSync();
      store.updateState(meta.mapToState(data, store.getState()));
      endSync();
    },
  });

  return () => subscription.unsubscribe();
}
