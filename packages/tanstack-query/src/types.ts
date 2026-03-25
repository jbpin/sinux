import type { QueryKey } from '@tanstack/react-query';

export const QUERY_SIGNAL = Symbol('sinux-query-signal');
export const MUTATION_SIGNAL = Symbol('sinux-mutation-signal');

export interface QuerySignalOptions<T, TData = any, TArgs extends any[] = any[]> {
  queryKey: QueryKey | ((...args: TArgs) => QueryKey);
  queryFn: (...args: TArgs) => Promise<TData>;
  mapToState: (data: TData, state: T) => Partial<T>;
  onFetch?: (state: T, ...args: TArgs) => Partial<T>;
  onError?: (error: unknown, state: T, ...args: TArgs) => Partial<T>;
  staleTime?: number;
  gcTime?: number;
  select?: (data: TData) => any;
}

export interface MutationSignalOptions<T, TData = any, TArgs extends any[] = any[]> {
  mutationFn: (...args: TArgs) => Promise<TData>;
  mapToState: (data: TData, state: T) => Partial<T>;
  optimistic?: (state: T, ...args: TArgs) => Partial<T>;
  onError?: (error: unknown, state: T, ...args: TArgs) => Partial<T> | void;
  invalidates?: QueryKey[];
  awaitInvalidation?: boolean;
}

export interface TanstackQueryOptions {
  queryClient: import('@tanstack/react-query').QueryClient | (() => import('@tanstack/react-query').QueryClient);
}

export type QuerySignalHandler<T> = ((state: T, ...args: any[]) => Promise<Partial<T>>) & {
  [QUERY_SIGNAL]?: QuerySignalOptions<T>;
};

export type MutationSignalHandler<T> = ((state: T, ...args: any[]) => Promise<Partial<T>>) & {
  [MUTATION_SIGNAL]?: MutationSignalOptions<T>;
};
