function Command(signal, fx) {
  console.log('WARNING: Command are deprecated. Please use signal.add method like in \'store.action.add((state, args) => ...)');
  signal.add(fx);
}

module.exports = Command;