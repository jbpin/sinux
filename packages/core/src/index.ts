export { Signal } from './signal';
import { Signal } from './signal';
import { Store } from './store';
import { TransformArgumentsToSignalInstances, SignalDef } from './types';

export function createStore<T, U extends SignalDef<T> = SignalDef<T>>(
  initialState: T,
  signals?: U
): Store<T> & TransformArgumentsToSignalInstances<T, U> {
  class ExtendedStore extends Store<T> {}
  const store = new ExtendedStore(initialState);
  
  const methodNames = Array.isArray(signals) ? signals : Object.keys(signals || {});
  for (const methodName of methodNames) {
    const s = new Signal(methodName);
    if (!Array.isArray(signals) && signals[methodName]) {
      s.add(signals[methodName]);
    }
    
    ExtendedStore.prototype[methodName] = function(...args) {
      return s.dispatch(this.getState(), ...args).then((newState) => {
        return this.updateState(newState);
      });
    }.bind(store);
  }
  return store as Store<T> & TransformArgumentsToSignalInstances<T, U>;
}

export { Store };
