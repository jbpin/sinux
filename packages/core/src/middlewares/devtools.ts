import { MiddlewareConfig } from '../middleware';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: {
      connect(options?: { name?: string }): {
        init(state: any): void;
        send(action: { type: string }, state: any): void;
        subscribe(listener: (message: any) => void): (() => void);
      };
    };
  }
}

export function devtools<T>(options?: { name?: string; enabled?: boolean }): MiddlewareConfig<T> {
  let connection: ReturnType<NonNullable<Window['__REDUX_DEVTOOLS_EXTENSION__']>['connect']> | null = null;

  return {
    onInit(store) {
      if (options?.enabled === false) return;
      if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) return;

      connection = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
        name: options?.name || 'Sinux Store'
      });
      connection.init(store.getState());
    },
    onStateChange(state, _prevState, signalName) {
      connection?.send({ type: signalName }, state);
    }
  };
}
