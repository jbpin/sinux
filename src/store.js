import Signal from './signal'

export default class Store {
  constructor(initialState, ...signals){
    this.state = initialState;
    // signal for the store
    this.changed = new Signal('storeChanged');

    const resetSignal = new Signal('resetStore');
    resetSignal.add(() => {
      this.state = initialState;
      this.changed.dispatch(this.getState());
    });
    this['resetStore'] = () => {
      return resetSignal.dispatch();
    }
    // create signals
    this.addSignals(...signals);
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
          this.updateState(newState);
          return newState;
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
  }
}