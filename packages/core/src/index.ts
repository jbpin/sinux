export { Signal } from './signal';
import { Signal } from './signal';
import { Store } from './store';

type Shift<T extends any[]> = ((...args: T) => any) extends (first: any, ...rest: infer R) => any ? R : never;

type OmitState<T extends [state?: any, ...rest: any[]]> = Shift<T>;

type FunctionFromTuple<T extends any[]> = (...args: OmitState<T>) => any;

type SignalFn<T extends any[]> = Signal<T> & FunctionFromTuple<T>;

type TransformObjectToSignalInstances<T extends Record<string, (...any: any) => any>> = {
  [K in keyof T]: SignalFn<Parameters<T[K]>>;
};

export function createStore<T, U>(initialState: T, methods: U): Store<T> & TransformObjectToSignalInstances<U> {
  class Extended extends Store<T> {}

  for (const [methodName, method] of Object.entries(methods)) {
    const s = new Signal(methodName);
    s.add(method);
    Extended.prototype[methodName] = (...args) => {
      return Signal.prototype.dispatch.call(s, this.getState(), ...args).then((newState) => {
        return this.updateState(newState);
      });
    };
  }
  return new Extended(initialState) as any as Store<T> & TransformObjectToSignalInstances<U>;
}

export { Store };
