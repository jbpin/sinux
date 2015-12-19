import co from 'co';

class Signal {

  constructor(){
    this.commands = new Set();
  }

  add(command){
    this.commands.add(command)
  }

  dispatch(...args) {
    // compute listener promise
    return co(function* (){
      for(let c in this.commands){
        yield c.execute(...args);
      }
    })//.catch(onError);
  }

  remove(command) {
    _commands.delete(command);
  }
}

export default Signal