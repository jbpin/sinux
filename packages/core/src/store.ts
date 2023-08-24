import {Signal} from './signal'

export class Store<T> {
  private resetSignal: Signal<any>
  
  state:T
  changed: Signal<any>

  constructor(initialState: T, ...signals: (Signal<any>|string)[]){
    this.state = initialState;
    // signal for the store
    this.changed = new Signal('storeChanged');

    this.resetSignal = new Signal('resetStore');
    this.resetSignal.add(() => {
      this.state = initialState;
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
        return Signal.prototype.dispatch.call(s, this.getState(), ...args).then((newState) => {
          return this.updateState(newState);
        });
      };
      this[name].__proto__ = s;
    })
  }

  getState() {
    return {...this.state};
  }

  updateState(payload) {
    this.state = {...this.state, ...payload};
    this.changed.dispatch(this.getState());
    return this.getState();
  }
}