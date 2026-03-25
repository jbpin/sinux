import { QUERY_SIGNAL, QuerySignalOptions } from './types';

export function querySignal<T, TData = any, TArgs extends any[] = any[]>(
  opts: QuerySignalOptions<T, TData, TArgs>
) {
  // Signal handler that conforms to (state, ...args) => Promise<Partial<T>>
  // Falls back to direct fetch if tanstackQuery middleware is not installed
  const handler = async (state: T, ...args: TArgs): Promise<Partial<T>> => {
    const data = await opts.queryFn(...args);
    const selected = opts.select ? opts.select(data) : data;
    return opts.mapToState(selected as TData, state);
  };

  // Attach metadata for middleware detection
  Object.defineProperty(handler, QUERY_SIGNAL, {
    value: opts,
    enumerable: false,
    configurable: false,
  });

  return handler;
}
