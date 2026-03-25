import { Store } from './store';
import { Signal } from './signal';

export type MiddlewareConfig<T> = {
  onInit?: (store: Store<T>) => void;
  onDispatch?: (context: {
    signalName: string;
    args: any[];
    getState: () => T;
    signal: Signal<T, any>;
    next: (...args: any[]) => Promise<Partial<T> | void>;
  }) => Promise<Partial<T> | void>;
  onStateChange?: (state: T, prevState: T, signalName: string) => void;
};
