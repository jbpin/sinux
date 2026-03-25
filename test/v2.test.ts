import { describe, it, expect } from 'vitest';
import { Store, Signal, createStore, computed, computedFrom } from '../packages/core/src/index';

describe('Shallow-equal optimization', () => {
  it('should NOT fire changed when signal returns identical state values', async () => {
    const store = new Store({ count: 1, label: 'hello' }, 'noop') as any;
    store.noop.add(() => ({ count: 1, label: 'hello' }));

    let changeFired = false;
    store.changed.add(() => { changeFired = true; });

    await store.noop();
    expect(changeFired).toBe(false);
  });

  it('should fire changed when state actually changes', async () => {
    const store = new Store({ count: 1 }, 'inc') as any;
    store.inc.add((state: any) => ({ count: state.count + 1 }));

    let newState: any = null;
    store.changed.add((state: any) => { newState = state; });

    await store.inc();
    expect(newState).toEqual({ count: 2 });
  });

  it('updateState returns current state without dispatching changed when shallowEqual', () => {
    const store = new Store({ a: 1, b: 2 });
    let changeFired = false;
    store.changed.add(() => { changeFired = true; });

    const result = store.updateState({ a: 1, b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
    expect(changeFired).toBe(false);
  });

  it('updateState returns undefined when payload is void', () => {
    const store = new Store({ x: 10 });
    let changeFired = false;
    store.changed.add(() => { changeFired = true; });

    const result = store.updateState(undefined);
    expect(result).toBeUndefined();
    expect(changeFired).toBe(false);
  });
});

describe('Middleware system', () => {
  it('onInit is called with the store after creation', () => {
    let receivedStore: any = null;
    const mw = { onInit(store: any) { receivedStore = store; } };
    const store = createStore({ count: 0 }, { inc: (state: any) => ({ count: state.count + 1 }) }, [mw]);

    expect(receivedStore).not.toBeNull();
    expect(receivedStore.getState()).toEqual({ count: 0 });
  });

  it('onDispatch is called with correct signalName and args', async () => {
    let capturedName: string | null = null;
    let capturedArgs: any[] | null = null;

    const mw = {
      onDispatch({ signalName, args, getState, next }: any) {
        capturedName = signalName;
        capturedArgs = args;
        return next(getState(), ...args);
      },
    };

    const store = createStore(
      { count: 0 },
      { add: (state: any, amount: number) => ({ count: state.count + amount }) },
      [mw]
    ) as any;

    await store.add(5);
    expect(capturedName).toBe('add');
    expect(capturedArgs).toEqual([5]);
    expect(store.getState()).toEqual({ count: 5 });
  });

  it('onStateChange fires with new state, previous state, and signal name', async () => {
    let changeArgs: any = null;
    const mw = {
      onStateChange(state: any, prevState: any, signalName: string) {
        changeArgs = { state, prevState, signalName };
      },
    };

    const store = createStore(
      { count: 0 },
      { inc: (state: any) => ({ count: state.count + 1 }) },
      [mw]
    ) as any;

    await store.inc();
    expect(changeArgs).not.toBeNull();
    expect(changeArgs.state).toEqual({ count: 1 });
    expect(changeArgs.prevState).toEqual({ count: 0 });
    expect(changeArgs.signalName).toBe('inc');
  });

  it('onStateChange does NOT fire when signal returns void', async () => {
    let changeCalled = false;
    const mw = { onStateChange() { changeCalled = true; } };

    const store = createStore(
      { count: 0 },
      { noop: () => { /* void */ } },
      [mw]
    ) as any;

    await store.noop();
    expect(changeCalled).toBe(false);
  });

  it('multiple middlewares compose in onion order', async () => {
    const order: string[] = [];

    const mw1 = {
      onDispatch({ getState, args, next }: any) {
        order.push('mw1-before');
        return next(getState(), ...args).then((r: any) => { order.push('mw1-after'); return r; });
      },
    };
    const mw2 = {
      onDispatch({ getState, args, next }: any) {
        order.push('mw2-before');
        return next(getState(), ...args).then((r: any) => { order.push('mw2-after'); return r; });
      },
    };

    const store = createStore(
      { count: 0 },
      { inc: (state: any) => ({ count: state.count + 1 }) },
      [mw1, mw2]
    ) as any;

    await store.inc();
    expect(order).toEqual(['mw1-before', 'mw2-before', 'mw2-after', 'mw1-after']);
  });
});

describe('Computed state', () => {
  it('returns an object with get() and subscribe()', () => {
    const store = createStore({ count: 0 }, { inc: (s: any) => ({ count: s.count + 1 }) });
    const doubled = computed(store, (s) => s.count * 2);
    expect(typeof doubled.get).toBe('function');
    expect(typeof doubled.subscribe).toBe('function');
  });

  it('get() returns the derived value', () => {
    const store = createStore({ count: 3 }, { inc: (s: any) => ({ count: s.count + 1 }) });
    const doubled = computed(store, (s) => s.count * 2);
    expect(doubled.get()).toBe(6);
  });

  it('updates when source store changes', async () => {
    const store = createStore({ count: 1 }, { inc: (s: any) => ({ count: s.count + 1 }) }) as any;
    const doubled = computed(store, (s: any) => s.count * 2);
    expect(doubled.get()).toBe(2);
    await store.inc();
    expect(doubled.get()).toBe(4);
  });

  it('does NOT notify when deriveFn returns same reference', async () => {
    const store = createStore(
      { count: 1, unrelated: 'a' },
      { changeUnrelated: (s: any) => ({ ...s, unrelated: s.unrelated + '!' }) }
    ) as any;

    const countOnly = computed(store, (s: any) => s.count);
    let calls = 0;
    countOnly.subscribe(() => { calls++; });

    await store.changeUnrelated();
    expect(calls).toBe(0);
    expect(countOnly.get()).toBe(1);
  });

  it('subscribe returns unsubscribe function', async () => {
    const store = createStore({ count: 0 }, { inc: (s: any) => ({ count: s.count + 1 }) }) as any;
    const doubled = computed(store, (s: any) => s.count * 2);

    let calls = 0;
    const unsub = doubled.subscribe(() => { calls++; });

    await store.inc();
    expect(calls).toBe(1);
    unsub();
    await store.inc();
    expect(calls).toBe(1);
  });

  it('computedFrom works with multiple stores', async () => {
    const storeA = createStore({ a: 2 }, { setA: (_s: any, val: number) => ({ a: val }) }) as any;
    const storeB = createStore({ b: 3 }, { setB: (_s: any, val: number) => ({ b: val }) }) as any;

    const sum = computedFrom([storeA, storeB], (a: any, b: any) => a.a + b.b);
    expect(sum.get()).toBe(5);

    await storeA.setA(10);
    expect(sum.get()).toBe(13);

    await storeB.setB(7);
    expect(sum.get()).toBe(17);
  });

  it('computedFrom subscriber fires when any source changes', async () => {
    const storeA = createStore({ x: 1 }, { bump: (s: any) => ({ x: s.x + 1 }) }) as any;
    const storeB = createStore({ y: 10 }, { bump: (s: any) => ({ y: s.y + 1 }) }) as any;

    const total = computedFrom([storeA, storeB], (a: any, b: any) => a.x + b.y);
    let notified = 0;
    total.subscribe(() => { notified++; });

    await storeA.bump();
    expect(notified).toBe(1);
    expect(total.get()).toBe(12);

    await storeB.bump();
    expect(notified).toBe(2);
    expect(total.get()).toBe(13);
  });
});

describe('createStore with signal record', () => {
  it('creates signals with handlers attached', () => {
    const store = createStore({ count: 0 }, {
      increment: (s: any) => ({ count: s.count + 1 }),
      add: (s: any, amount: number) => ({ count: s.count + amount }),
    }) as any;

    expect(typeof store.increment).toBe('function');
    expect(typeof store.add).toBe('function');
  });

  it('calling a record signal updates state', async () => {
    const store = createStore({ count: 0 }, {
      increment: (s: any) => ({ count: s.count + 1 }),
      add: (s: any, amount: number) => ({ count: s.count + amount }),
    }) as any;

    await store.increment();
    expect(store.getState()).toEqual({ count: 1 });
    await store.add(4);
    expect(store.getState()).toEqual({ count: 5 });
  });

  it('string array still works (backward compat)', async () => {
    const store = createStore({ val: 0 }, ['set'] as const) as any;
    store.set.add((_s: any, v: number) => ({ val: v }));
    await store.set(42);
    expect(store.getState()).toEqual({ val: 42 });
  });

  it('store.changed fires after record signal updates state', async () => {
    const store = createStore({ n: 0 }, { inc: (s: any) => ({ n: s.n + 1 }) }) as any;

    let firedState: any = null;
    store.changed.add((state: any) => { firedState = state; });

    await store.inc();
    expect(firedState).toEqual({ n: 1 });
  });
});
