import co from 'co';

class Signal {

  constructor(name){
    if(!name){
      throw new Error('Signal name is mandatory');
    }
    this.name = name;
    this.commands = [];
  }

  add(command){
    if(this.commands.indexOf(command) === -1){
      this.commands.push(command)
    }
  }

  dispatch(...args) {
    // compute listener promise
    var commands = this.commands
    return co(function* (){
      var result = {}
      for (let i =  0; i < commands.length; i++) {
        let r = yield commands[i].execute(...args)
        result = {...result, ...r}
      }
      return result
    }).catch((e) => console.log('error', e))
  }

  remove(command) {
    _commands.delete(command);
  }
}

export default Signal