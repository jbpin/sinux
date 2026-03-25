async function runGenerator(gen: Generator): Promise<any> {
  let step = gen.next();
  while (!step.done) {
    const value = await step.value;
    step = gen.next(value);
  }
  return step.value;
}

export class Signal<T, U extends (...args) => any> {
  name: string;
  commands: Set<Function>;

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
      let r = await c.apply(null, args);
      // Handle generator iterators (like co)
      if (r && typeof r.next === 'function' && typeof r[Symbol.iterator] === 'function') {
        r = await runGenerator(r);
      }
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