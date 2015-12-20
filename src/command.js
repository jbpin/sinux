import co from 'co';

class Command {
  constructor(signal, fx) {
    this.fx = fx;
    signal.add(this);
  }

  execute(...args) {
    return co(this.fx, ...args);
  }
}

export default Command