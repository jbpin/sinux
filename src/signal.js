import co from 'co';

export default class Signal {

  constructor(name){
    this.name = name || Math.random().toString(36).substr(2, 5);
    this.commands = new Set();
  }

  add(command){
    if(!this.commands.has(command)){
      this.commands.add(command)
    }
  }

  dispatch(...args) {
    // compute listener promise
    const commands = this.commands
    return co(function *(){
      let result;
      for (let c of commands) {
        let r = null;
        if(c.execute){
          r = yield c.execute(...args);
        }else{
          r = c(...args);
        }
        if (commands.size === 1) {
          result = r;
        } else {
          result = {...r, ...result};
        }
      }
      return result;
    });
  }

  remove(command) {
    this.commands.delete(command);
  }
}