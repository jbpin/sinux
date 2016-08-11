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
      let s = signal;
      let name = signal;
      if('string' === typeof s) {
        s = new Signal(name);
      }else{
        name = s.name || s.__proto__.name;
      }
      if(this[name]){
        return;
      }
      this[name] = (...args) => {
        return Signal.prototype.dispatch.call(s, this.getState(), ...args).then((payload) => {
          this.updateState(payload);
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