import { produce } from 'immer';
import { MiddlewareConfig } from '../middleware';

export function immer<T>(): MiddlewareConfig<T> {
  return {
    onDispatch({ args, signal, getState }) {
      let currentState = getState();

      const commandsIterator = async () => {
        for (const command of signal.commands) {
          currentState = produce(currentState, (draft) => {
            const returned = command(draft, ...args);
            if (returned && typeof returned === 'object' && !(returned instanceof Promise)) {
              Object.assign(draft, returned);
            }
          });
        }
        return currentState;
      };

      return commandsIterator();
    }
  };
}
