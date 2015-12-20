import Signal from './signal'

export default class Store {
  constructor(initialState, ...signals){
    this.state = {...initialState};
    this.addSignals(signals);
  }

  addSignals(signals) {
    signals = [].concat(signals);
    signals.forEach((signal) => {
      if(this[signal]){
        return;
      }
      let s = new Signal();
      this[signal] = (...args) => {
        return Signal.prototype.dispatch.call(s, this.getState(), ...args).then((payload) => {
          this.updateState(payload);
        });
      };
      this[signal].__proto__ = s;
    })
  }

  getState() {
    return {...this.state};
  }

  updateState(payload) {
    this.state = {...this.state, ...payload};
    // dispatch update;
  }
}