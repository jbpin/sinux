import {Signal} from './signal'
import {shallowEqual} from './utils'

export class Store<T> {
  private resetSignal: Signal<T, () => void>
  private _listeners = new Set<() => void>();

  state:T
  changed: Signal<T, (state:T)=> any>

  private _notifyListeners() {
    this._listeners.forEach(cb => cb());
  }

  constructor(initialState: T, ...signals: (Signal<T, any>|string)[]){
    this.state = initialState;
    // signal for the store
    this.changed = new Signal('storeChanged');

    this.resetSignal = new Signal('resetStore');
    this.resetSignal.add(() => {
      this.state = initialState;
      this._notifyListeners();
      this.changed.dispatch(this.getState());
    });
    
    // create signals
    this.addSignals(...signals);
  }

  resetStore() {
    return this.resetSignal?.dispatch()
  }

  addSignals(...signals) {
    signals.forEach((signal) => {
      const s = 'string' === typeof signal ? new Signal(signal) : signal;
      let name = s.name || s.__proto__.name || signal;
      if (this[name]) {
        throw new Error('This signal is already present. You can\'t add it.');
      }
      this[name] = (...args) => {
        return s.dispatch(this.getState(), ...args).then((newState) => {
          return this.updateState(newState);
        });
      };
      this[name].__proto__ = s;
    })
  }

  getState(): T {
    return {...this.state};
  }

  updateState(payload: Partial<T>| void) {
    if (!payload){
      return;
    }
    const nextState = {...this.state, ...payload};
    if (shallowEqual(this.state, nextState)) {
      return this.getState();
    }
    this.state = nextState;
    this._notifyListeners();
    this.changed.dispatch(this.getState());
    return this.getState();
  }

  subscribe = (cb: () => void): ()=> void => {
    this._listeners.add(cb);
    return () => {
      this._listeners.delete(cb);
    };
  };
}