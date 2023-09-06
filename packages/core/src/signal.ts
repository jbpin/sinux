export class Signal<T, U extends (...args) => any> {
  name: string;
  private commands: Set<Function>;

  constructor(name?: string){
    this.name = name || Math.random().toString(36).slice(2, 5);
    this.commands = new Set();
  }

  add(command: U | ((state:T, ...args) => Partial<T> | Promise<Partial<T>>)){
    if(!this.commands.has(command)){
      this.commands.add(command)
    }
  }

  async dispatch(...args: Parameters<U>) {
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

  remove(command: U) {
    this.commands.delete(command);
  }
}