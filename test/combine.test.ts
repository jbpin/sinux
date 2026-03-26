import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../packages/core/src/index';
import { combine } from '../packages/react/src/index';

describe('combine', () => {
  it('should merge initial state from all stores', () => {
    const storeA = createStore({ name: 'Alice' }, {});
    const storeB = createStore({ age: 30 }, {});

    const combined = combine(storeA, storeB);
    expect(combined.snapshot()).toEqual({ name: 'Alice', age: 30 });
  });

  it('should update combined state when a store changes', async () => {
    const storeA = createStore(
      { name: 'Alice' },
      { setName: (_s: any, name: string) => ({ name }) }
    ) as any;
    const storeB = createStore({ age: 30 }, {});

    const combined = combine(storeA, storeB);
    const cb = vi.fn();
    combined.subscribe(cb);

    await storeA.setName('Bob');

    expect(cb).toHaveBeenCalled();
    expect(combined.snapshot()).toEqual({ name: 'Bob', age: 30 });
  });

  it('should update combined state when any store changes', async () => {
    const storeA = createStore(
      { name: 'Alice' },
      { setName: (_s: any, name: string) => ({ name }) }
    ) as any;
    const storeB = createStore(
      { age: 30 },
      { setAge: (_s: any, age: number) => ({ age }) }
    ) as any;

    const combined = combine(storeA, storeB);
    const cb = vi.fn();
    combined.subscribe(cb);

    await storeA.setName('Bob');
    expect(cb).toHaveBeenCalledTimes(1);
    expect(combined.snapshot()).toEqual({ name: 'Bob', age: 30 });

    await storeB.setAge(25);
    expect(cb).toHaveBeenCalledTimes(2);
    expect(combined.snapshot()).toEqual({ name: 'Bob', age: 25 });

    // combined.state must also reflect the latest state (not stale initial)
    expect(combined.state).toEqual({ name: 'Bob', age: 25 });
  });

  it('should unsubscribe from all stores', async () => {
    const storeA = createStore(
      { name: 'Alice' },
      { setName: (_s: any, name: string) => ({ name }) }
    ) as any;
    const storeB = createStore(
      { age: 30 },
      { setAge: (_s: any, age: number) => ({ age }) }
    ) as any;

    const combined = combine(storeA, storeB);
    const cb = vi.fn();
    const unsub = combined.subscribe(cb);

    await storeA.setName('Bob');
    expect(cb).toHaveBeenCalledTimes(1);

    unsub();

    await storeB.setAge(25);
    expect(cb).toHaveBeenCalledTimes(1); // no new call after unsub
  });

  it('subscribe callback should be called synchronously on state change', async () => {
    const store = createStore(
      { count: 0 },
      { inc: (s: any) => ({ count: s.count + 1 }) }
    ) as any;

    const combined = combine(store);
    const order: string[] = [];

    combined.subscribe(() => {
      order.push('cb');
    });

    // updateState fires changed.dispatch synchronously for the first handler
    // but we need to verify the cb is called before the await resolves
    store.updateState({ count: 99 });
    order.push('after-updateState');

    // If cb was called synchronously, order should be ['cb', 'after-updateState']
    // If cb was called in a microtask, order would be ['after-updateState', 'cb']
    expect(order).toEqual(['cb', 'after-updateState']);
  });

  it('all subscribers should be called synchronously on state change', async () => {
    const store = createStore(
      { count: 0 },
      { inc: (s: any) => ({ count: s.count + 1 }) }
    ) as any;

    const order: string[] = [];

    // First subscriber via store.subscribe
    store.subscribe(() => {
      order.push('direct-subscribe');
    });

    // Second subscriber via combine
    const combined = combine(store);
    combined.subscribe(() => {
      order.push('combine-subscribe');
    });

    store.updateState({ count: 99 });
    order.push('after-updateState');

    // Both must fire synchronously for useSyncExternalStore compatibility
    expect(order).toEqual(['direct-subscribe', 'combine-subscribe', 'after-updateState']);
  });

  it('three stores combined, all notify synchronously', async () => {
    const storeA = createStore({ a: 1 }, { setA: (_s: any, v: number) => ({ a: v }) }) as any;
    const storeB = createStore({ b: 2 }, { setB: (_s: any, v: number) => ({ b: v }) }) as any;
    const storeC = createStore({ c: 3 }, { setC: (_s: any, v: number) => ({ c: v }) }) as any;

    const combined = combine(storeA, storeB, storeC);

    // Simulate what useSyncExternalStore does: subscribe + check snapshot
    let snapshotAtNotification: any = null;
    combined.subscribe(() => {
      snapshotAtNotification = combined.snapshot();
    });

    await storeB.setB(20);

    expect(snapshotAtNotification).toEqual({ a: 1, b: 20, c: 3 });
  });
});

describe('store.subscribe', () => {
  it('callback should be called synchronously when state changes', () => {
    const store = createStore(
      { count: 0 },
      { inc: (s: any) => ({ count: s.count + 1 }) }
    ) as any;

    const order: string[] = [];
    store.subscribe(() => {
      order.push('subscribe-cb');
    });

    store.updateState({ count: 1 });
    order.push('after-updateState');

    // subscribe callback must fire synchronously for useSyncExternalStore
    expect(order).toEqual(['subscribe-cb', 'after-updateState']);
  });

  it('multiple subscribers should all be called synchronously', () => {
    const store = createStore({ count: 0 }, {}) as any;

    const order: string[] = [];
    store.subscribe(() => order.push('sub1'));
    store.subscribe(() => order.push('sub2'));

    store.updateState({ count: 1 });
    order.push('after-updateState');

    // Both must fire synchronously for useSyncExternalStore compatibility
    expect(order).toEqual(['sub1', 'sub2', 'after-updateState']);
  });
});
