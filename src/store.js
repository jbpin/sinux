import Signal from './signal'

export default class Store {
  constructor(initialState, ...signals){
    this.state = {...initialState};
    this.addSignals(signals);
  }

  addSignals(signals) {
    signals = [].concat(signals);
    signals.forEach((signal) => {
      let s = signal;
      let name = signal;
      if(s instanceof Signal) {
        name = s.name;
      }else{
        s = new Signal(signal);
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
    // dispatch update;
  }
}