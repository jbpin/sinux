import { Signal } from './signal';
import { Store } from './store';
import { TransformArgumentsToSignalInstances, SignalDef } from './types';
import { MiddlewareConfig } from './middleware';

export function createStore<T, U extends SignalDef<T> = SignalDef<T>>(
  initialState: T,
  signals?: U,
  middlewares?: MiddlewareConfig<T>[]
): Store<T> & TransformArgumentsToSignalInstances<T, U> {
  class ExtendedStore extends Store<T> {}
  const store = new ExtendedStore(initialState);
  const mws = middlewares || [];

  const methodNames = Array.isArray(signals) ? signals : Object.keys(signals || {});
  for (const methodName of methodNames) {
    const s = new Signal(methodName);
    if (!Array.isArray(signals) && signals[methodName]) {
      s.add(signals[methodName]);
    }

    // Build middleware dispatch chain
    const originalNext = (...args) => s.dispatch(...args);
    const wrappedDispatch = mws.reduceRight(
      (next, mw) => {
        if (!mw.onDispatch) return next;
        return (...args) => mw.onDispatch({
          signalName: methodName,
          args: args.slice(1),
          getState: () => store.getState(),
          signal: s,
          next
        });
      },
      originalNext
    );

    ExtendedStore.prototype[methodName] = function(...args) {
      const prevState = this.getState();
      return wrappedDispatch(this.getState(), ...args).then((newState) => {
        const result = this.updateState(newState);
        if (result) {
          mws.forEach(mw =>
            mw.onStateChange?.(this.getState(), prevState, methodName)
          );
        }
        return result;
      });
    }.bind(store);
    ExtendedStore.prototype[methodName].__proto__ = s;
  }

  // Initialize middlewares after all signals are wired
  mws.forEach(mw => mw.onInit?.(store));

  return store as Store<T> & TransformArgumentsToSignalInstances<T, U>;
}

export { Store };
export { Signal } from './signal';
export type { MiddlewareConfig } from './middleware';
export { computed, computedFrom } from './computed';
export type { ComputedValue } from './computed';
export { devtools } from './middlewares/devtools';
export { persist } from './middlewares/persist';
export type { PersistOptions, SinuxStorage } from './middlewares/persist';
export { immer } from './middlewares/immer';
