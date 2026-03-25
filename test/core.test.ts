import { describe, it, expect } from 'vitest';
import { Store, Signal } from '../packages/core/src/index';

describe('Store', () => {
  it('should create a store with an initialState', () => {
    const s = new Store({ foo: 'bar' });
    expect(s.getState()).toEqual({ foo: 'bar' });
  });

  it('should create a store with signal', () => {
    const s = new Store({}, 'test') as any;
    expect(s.test).toBeInstanceOf(Signal);
    expect(typeof s.test).toBe('function');
  });

  it('should create a store with signal object', () => {
    const s = new Store({ test: 1 }, new Signal('test')) as any;
    expect(s.test).toBeInstanceOf(Signal);
    expect(typeof s.test).toBe('function');
  });

  it('should expose a signal that returns a promise', () => {
    const s = new Store({}, 'test') as any;
    const p = s.test();
    expect(p).toHaveProperty('then');
    expect(typeof p.then).toBe('function');
  });

  it('should not override signal', () => {
    const s = new Store({}, 'test');
    expect(() => s.addSignals('test')).toThrow();
  });

  it('should be able to plug stores together', async () => {
    const s = new Store({}, 'test') as any;
    const s2 = new Store({}, 'test') as any;
    const s3 = new Store({}, 'test') as any;

    s.test.add((state: any, s2Signal: any) => {
      return function* () {
        yield s2Signal({ store: 2 });
        yield s3.test({ store: 3 });
        return { foo: 'bar' };
      }();
    });

    s2.test.add((state: any, args: any) => ({ ...state, ...args }));
    s3.test.add((state: any, args: any) => ({ ...state, ...args }));

    await s.test(s2.test);

    expect(s.getState()).toEqual({ foo: 'bar' });
    expect(s2.getState()).toEqual({ store: 2 });
    expect(s3.getState()).toEqual({ store: 3 });
  });

  it('should update the state', async () => {
    const s = new Store({ test: 2 }, 'test') as any;
    s.test.add((state: any, args: any) => ({ ...state, ...args }));
    await s.test({ foo: 'bar' });
    expect(s.getState()).toEqual({ test: 2, foo: 'bar' });
  });

  it('should reset to the initial state', async () => {
    const s = new Store({ test: 2 }, 'test') as any;
    s.test.add((state: any, args: any) => ({ ...state, ...args }));
    await s.test({ foo: 'bar' });
    expect(s.getState()).toEqual({ test: 2, foo: 'bar' });
    await s.resetStore();
    expect(s.getState()).toEqual({ test: 2 });
  });

  it('should support extended dispatch/updateState', async () => {
    const s = new Store({ test: 2 }, 'test') as any;
    s.test.add((state: any, args: any) => ({ ...state, ...args }));
    const result = await s.test.dispatch(s.getState(), { foo: 'bar' }).then((r: any) => s.updateState(r));
    expect(result).toEqual(s.getState());
  });

  it('should support dependencies between stores - Promise', async () => {
    const s1 = new Store({ a: 1 }, 'test') as any;
    s1.test.add((state: any, args: any) =>
      new Promise((resolve) => setTimeout(() => resolve({ ...state, ...args })))
    );

    const s2 = new Store({}, 'test') as any;
    s2.test.add((state: any, args: any) => s1.test(args).then((s1State: any) => s1State));

    await s2.test({ foo: 'bar' });
    expect(s1.getState()).toEqual(s2.getState());
  });

  it('should support dependencies between stores - Async/Await', async () => {
    const s1 = new Store({ a: 1 }, 'test') as any;
    s1.test.add((state: any, args: any) =>
      new Promise((resolve) => setTimeout(() => resolve({ ...state, ...args })))
    );

    const s2 = new Store({}, 'test') as any;
    s2.test.add((_state: any, _args: any) =>
      (async () => await s1.test({ foo: 'bar' }))()
    );

    await s2.test();
    expect(s1.getState()).toEqual(s2.getState());
  });

  it('should support dependencies between stores - Generator', async () => {
    const s1 = new Store({ a: 1 }, 'test') as any;
    s1.test.add((state: any, args: any) =>
      new Promise((resolve) => setTimeout(() => resolve({ ...state, ...args })))
    );

    const s2 = new Store({}, 'test') as any;
    s2.test.add((_state: any, _args: any) => {
      return function* () {
        const s1State = yield s1.test({ foo: 'bar' });
        return s1State;
      }();
    });

    await s2.test();
    expect(s1.getState()).toEqual(s2.getState());
  });
});

describe('Signal', () => {
  it('should process command when dispatched', async () => {
    const s = new Signal('test');
    s.add((test: any) => test);
    const value = await s.dispatch('test');
    expect(value).toBe('test');
  });

  it('should generate a name when not provided', () => {
    const s = new Signal();
    expect(s.name).toBeTruthy();
  });

  it('should remove a listener', () => {
    const s = new Signal('test');
    const fn = () => {};
    s.add(fn);
    expect(s.commands.has(fn)).toBe(true);
    s.remove(fn);
    expect(s.commands.has(fn)).toBe(false);
  });

  it('should not add an already added command', () => {
    const s = new Signal('test');
    const fn = () => {};
    s.add(fn);
    expect(s.commands.size).toBe(1);
    s.add(fn);
    expect(s.commands.size).toBe(1);
  });

  it('should have response in then handler', async () => {
    const s = new Signal('uppercase');
    s.add((text: string) => new Promise((resolve) => setTimeout(() => resolve(text.toUpperCase()))));
    const result = await s.dispatch('text');
    expect(result).toBe('TEXT');
  });
});
