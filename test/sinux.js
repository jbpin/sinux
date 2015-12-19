require("babel-polyfill");
import {expect} from 'chai'
import {Store, Signal, Command} from '../index'

describe('Store', () => {
  it('should create a store with an initialState', ()=>{
    var s = new Store({foo:"bar"});
    expect(s.getState()).to.be.deep.equal({foo:'bar'})
  })

  it('should create a store with signal', () => {
    expect(new Store({}, 'test')).to.have.property('test').that.is.an.instanceof(Signal).and.is.a('function')
  })

  it('should expose a signal that return a promise', () => {
    var s = new Store({}, 'test');
    var p = s.test();
    expect(p).to.have.property('then').that.is.a('function')
  })
})

describe('Commandand mapping', () => {
  it('should create a command', ()=>{
    var s = new Store({}, 'test');
    var c = new Command(s.test, (state, ...args) => { return {...args} })
    expect(c).to.be.ok
  })

  it('should update the state', () => {
    var s = new Store({}, 'test');
    var c = new Command(s.test, (state, ...args) => { return {...args} })
    s.test({foo:"bar"}).then( () => {
      expect(s.getState()).to.be.deep.equal({foo:'bar'});
    })
  })
});