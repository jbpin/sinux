import co from 'co';

class Signal {

  constructor(name){
    if(!name){
      throw new Error('Signal name is mandatory');
    }
    this.name = name;
    this.commands = new Set();
  }

  add(command){
    if(!this.commands.has(command)){
      this.commands.add(command)
    }
  }

  dispatch(...args) {
    // compute listener promise
    var commands = this.commands
    return co(function* (){
      var result = {}
      for (let c of commands) {
        let r = null;
        if(c.execute){
          r = yield c.execute(...args)
        }else{
          r = c(...args)
        }
        result = {...result, ...r}
      }
      return result
    })
  }

  remove(command) {
    this.commands.delete(command);
  }
}

export default Signal