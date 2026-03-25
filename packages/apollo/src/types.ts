import type { DocumentNode, TypedDocumentNode, ApolloClient, WatchQueryFetchPolicy } from '@apollo/client';

export const GRAPHQL_QUERY = Symbol('sinux-graphql-query');
export const GRAPHQL_MUTATION = Symbol('sinux-graphql-mutation');

export interface GraphQLQueryOptions<T, TData = any, TVars = any> {
  query: DocumentNode | TypedDocumentNode<TData, TVars>;
  variables?: TVars | ((...args: any[]) => TVars);
  mapToState: (data: TData, state: T) => Partial<T>;
  onFetch?: (state: T, ...args: any[]) => Partial<T>;
  onError?: (error: unknown, state: T, ...args: any[]) => Partial<T>;
  fetchPolicy?: WatchQueryFetchPolicy;
}

export interface GraphQLMutationOptions<T, TData = any, TVars = any> {
  mutation: DocumentNode | TypedDocumentNode<TData, TVars>;
  variables?: TVars | ((...args: any[]) => TVars);
  mapToState: (data: TData, state: T) => Partial<T>;
  optimistic?: (state: T, ...args: any[]) => Partial<T>;
  optimisticResponse?: any | ((...args: any[]) => any);
  onError?: (error: unknown, state: T, ...args: any[]) => Partial<T> | void;
  refetchQueries?: DocumentNode[];
  update?: (cache: any, result: any) => void;
}

export interface ApolloClientOptions {
  client: ApolloClient<any> | (() => ApolloClient<any>);
}
