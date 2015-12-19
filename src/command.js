import co from 'co';

class Command {
  constructor(signal, fx) {
    this.fx = fx;
    signal.add(this);
  }

  execute(store, ...args) {
    return co(this.fx.call(store.getState(), ...args)).then((payload) => store.update(payload));
  }
}

export default Command