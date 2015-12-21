require("babel-polyfill");
import co from 'co'
import {expect} from 'chai'
import {Store, Signal, Command} from '../index'

describe('Store', () => {
  it('should create a store with an initialState', function() {
    let s = new Store({foo:"bar"});
    expect(s.getState()).to.be.deep.equal({foo:'bar'})
  })

  it('should create a store with signal', function() {
    expect(new Store({}, 'test')).to.have.property('test').that.is.an.instanceof(Signal).and.is.a('function')
  })

  it('should create a store with signal object', function() {
    let s = new Store({test:1}, new Signal('test'))
    expect(s).to.have.property('test').that.is.an.instanceof(Signal).and.is.a('function')
  })

  it('should expose a signal that return a promise', function() {
    let s = new Store({}, 'test');
    let p = s.test.dispatch();
    expect(p).to.have.property('then').that.is.a('function')
  })

  it('should not override signal', function() {
    let s = new Store({}, 'test');
    let p = s.test;
    s.addSignals('test')
    expect(p).to.be.equal(s.test)
  })
})

describe('Command mapping', function() {
  it('should create a command', function() {
    let s = new Store({}, 'test');
    let c = new Command(s.test, (state, args) => { return {...state, ...args} })
    expect(c).to.be.ok
  })

  it('should return a promise on execute', function(done) {
    let s = new Store({}, 'test');
    let c = new Command(s.test, (state, args) => { return {...state, ...args} })
    var p = c.execute({foo:"bar"});
    p.then((value)=> {
      expect(value).to.be.deep.equal({foo:'bar'})
      done()
    })
  })

  it('should update the state', function(done) {
    let s = new Store({test:2}, 'test');
    let c = new Command(s.test, (state, args) => { return {...state, ...args} })
    s.test({foo:"bar"}).then( function(value) {
      expect(s.getState()).to.be.deep.equal({test:2, foo:'bar'})
      done()
    }, function (e) {
      done(e)
    })
  })

  it('should support async command', function(done) {
    let s = new Store({test:3}, 'test');
    let c = new Command(s.test, (state, args) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function() { resolve({...state, ...args}) }, 100);
      })
    })
    s.test({foo:"bar"}).then( function() {
      expect(s.getState()).to.be.deep.equal({test:3, foo:'bar'});
      done()
    })
  })
});

describe('Signal', function() {
  it('should work', function(done){
    co(function() { return true; }).then(value => done())
  })

  it('should process command when is dispatch', function(done) {
    let s = new Signal('test');
    let c = new Command(s, test => {
      return test;
    })
    s.dispatch('test').then(value => {
      done()
    })
  })
});