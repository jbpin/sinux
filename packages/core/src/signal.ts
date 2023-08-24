export class Signal<T> extends Function {
  name: string;
  private commands: Set<Function>;

  constructor(name?: string){
    super();
    this.name = name || Math.random().toString(36).slice(2, 5);
    this.commands = new Set();
  }

  add(command: (args: T) => unknown|Promise<unknown>){
    if(!this.commands.has(command)){
      this.commands.add(command)
    }
  }

  async dispatch(args?: T) {
    // compute listener promise
    let result;
    for (let c of this.commands) {
      const r = await c.call(args);
      if (this.commands.size === 1) {
        result = r;
      } else {
        if (Array.isArray(r) && !result || Array.isArray(result)) {
          result = [].concat(result || [], r)
        } else {
          result = {...r, ...result || {}};
        }
      }
    }
    return result;
  }

  remove(command: (...args) => unknown|Promise<unknown>) {
    this.commands.delete(command);
  }
}