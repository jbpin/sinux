import { querySignal } from '../query-signal';
import { mutationSignal } from '../mutation-signal';
import type { QuerySignalOptions } from '../types';

export interface TRPCProcedureConfig<T> {
  procedure: string | { query: Function; mutate?: Function } | { mutate: Function; query?: Function };
  type: 'query' | 'mutation';
  mapToState: (data: any, state: T) => Partial<T>;
  optimistic?: (state: T, ...args: any[]) => Partial<T>;
  onFetch?: (state: T, ...args: any[]) => Partial<T>;
  onError?: (error: unknown, state: T, ...args: any[]) => Partial<T> | void;
  invalidates?: string[];
  staleTime?: number;
  select?: (data: any) => any;
}

function resolveProcedure(client: any, path: string): any {
  return path.split('.').reduce((obj, key) => obj[key], client);
}

export function fromTRPC<T>(
  trpcClient: any,
  procedures: Record<string, TRPCProcedureConfig<T>>
): Record<string, (state: T, ...args: any[]) => Promise<Partial<T>>> {
  const signals: Record<string, any> = {};

  for (const [signalName, config] of Object.entries(procedures)) {
    const proc = typeof config.procedure === 'string'
      ? resolveProcedure(trpcClient, config.procedure)
      : config.procedure;

    if (config.type === 'query') {
      signals[signalName] = querySignal<T>({
        queryKey: typeof config.procedure === 'string'
          ? [config.procedure]
          : [signalName],
        queryFn: (...args: any[]) => proc.query(...args),
        mapToState: config.mapToState,
        onFetch: config.onFetch,
        onError: config.onError as QuerySignalOptions<T>['onError'],
        staleTime: config.staleTime,
        select: config.select,
      });
    } else {
      signals[signalName] = mutationSignal<T>({
        mutationFn: (...args: any[]) => proc.mutate(...args),
        mapToState: config.mapToState,
        optimistic: config.optimistic,
        onError: config.onError,
        invalidates: config.invalidates?.map(key =>
          typeof key === 'string' ? [key] : key
        ),
      });
    }
  }

  return signals;
}
