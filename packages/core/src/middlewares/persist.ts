import { MiddlewareConfig } from '../middleware';

export interface SinuxStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

export interface PersistOptions<T> {
  key: string;
  storage?: SinuxStorage;
  partialize?: (state: T) => Partial<T>;
  version?: number;
  migrate?: (persisted: any, version: number) => T | Promise<T>;
}

export function persist<T>(options: PersistOptions<T>): MiddlewareConfig<T> {
  const storage: SinuxStorage | undefined = options.storage ||
    (typeof localStorage !== 'undefined' ? localStorage : undefined);

  return {
    onInit(store) {
      if (!storage) return;

      const raw = storage.getItem(options.key);
      Promise.resolve(raw).then(value => {
        if (!value) return;

        const parsed = JSON.parse(value);
        const version = parsed.__version ?? 0;
        let restored = parsed.state;

        if (options.migrate && version !== (options.version ?? 0)) {
          restored = options.migrate(restored, version);
        }

        Promise.resolve(restored).then(s => {
          if (s) store.updateState(s);
        });
      });
    },
    onStateChange(state) {
      if (!storage) return;

      const toPersist = options.partialize ? options.partialize(state) : state;
      storage.setItem(
        options.key,
        JSON.stringify({ state: toPersist, __version: options.version ?? 0 })
      );
    }
  };
}
