import { MUTATION_SIGNAL, MutationSignalOptions } from './types';

export function mutationSignal<T, TData = any, TArgs extends any[] = any[]>(
  opts: MutationSignalOptions<T, TData, TArgs>
) {
  // Signal handler that conforms to (state, ...args) => Promise<Partial<T>>
  // Falls back to direct mutation if tanstackQuery middleware is not installed
  const handler = async (state: T, ...args: TArgs): Promise<Partial<T>> => {
    const data = await opts.mutationFn(...args);
    return opts.mapToState(data, state);
  };

  // Attach metadata for middleware detection
  Object.defineProperty(handler, MUTATION_SIGNAL, {
    value: opts,
    enumerable: false,
    configurable: false,
  });

  return handler;
}
