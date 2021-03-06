import co from 'co'
import {expect} from 'chai'
import {Store, Signal} from '../index'

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
    let p = s.test();
    expect(p).to.have.property('then').that.is.a('function')
  })

  it('should not override signal', function() {
    let s = new Store({}, 'test');
    const fn = () => s.addSignals('test');
    expect(fn).to.throw()
  })

  it('should be able to plug store together', function(done){
    let s = new Store({}, 'test');
    let s2 = new Store({}, 'test');
    let s3 = new Store({}, 'test');

    s.test.add( (state, s2Signal) => { return function* (){
      // passing signal as params
      yield s2Signal({store:2})
      // direct store signal access
      yield s3.test({store:3})
      return {foo:'bar'};
    }()})
    // return the instance of the generator function.

    s2.test.add((state, args) => {
      return {...state, ...args}
    });
    s3.test.add((state, args) => {
      return {...state, ...args}
    });

    s.test(s2.test);
    s.changed.add(function (value) {
      try{
        expect(s.getState()).to.be.deep.equal({foo:'bar'})
        expect(s2.getState()).to.be.deep.equal({store:2})
        expect(s3.getState()).to.be.deep.equal({store:3})
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should update the state', function(done) {
    let s = new Store({test:2}, 'test');
    let c = s.test.add((state, args) => { return {...state, ...args} })
    s.test({foo:"bar"})
    s.changed.add(function (value) {
      try{
        expect(s.getState()).to.be.deep.equal({test:2, foo:'bar'})
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should initialize the store to the initialState', function(done) {
    let s = new Store({test:2}, 'test');
    let c = s.test.add( (state, args) => { return {...state, ...args} });
    s.test({foo:"bar"}).then(function(){
      try{
        expect(s.getState()).to.be.deep.equal({test:2, foo:'bar'})
        s.resetStore().then(function(){
          expect(s.getState()).to.be.deep.equal({test:2})
          done();
        });
      }catch(e){
        done(e)
      }
    });
  })

  it('should update the state and dispatch an changed signal', function(done) {
    let s = new Store({test:2}, 'test');
    s.test.add((state, args) => { return {...state, ...args} })
    s.test({foo:"bar"});
    s.changed.add(function (value) {
      try{
        expect(s.getState()).to.be.deep.equal({test:2, foo:'bar'})
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should support an extended version of shortcut method', function(done) {
    let s = new Store({test:2}, 'test');
    s.test.add((state, args) => { return {...state, ...args} })
    s.test.dispatch(s.getState(), { foo: 'bar'}).then((result) => s.updateState(result)).then((result) => {
      try{
        expect(result).to.be.deep.equal(s.getState())
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should support dependencies between store - Promise', function(done) {
    let s1 = new Store({a:1}, 'test');
    s1.test.add( (state, args) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function() { resolve({...state, ...args}) });
      })
    });

    let s2 = new Store({}, 'test');
    s2.test.add( (state, args) => {
      return s1.test(args).then( (s1State) => s1State);
    });

    s2.test({foo: 'bar'});

    s2.changed.add(function (value) {
      try{
        expect(s1.getState()).to.be.deep.equal(s2.getState());
        done()
      }catch(e) {
        done(e)
      }
    })
  })

  it('should support dependencies between store - Async/Await', function(done) {
    let s1 = new Store({a:1}, 'test');
    s1.test.add( (state, args) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function() { resolve({...state, ...args}) });
      })
    })

    let s2 = new Store({}, 'test');
    s2.test.add( (state, args) => {
      return async function(){
        const s1State = await s1.test({foo:"bar"});
        return s1State;
      }();
    });

    s2.test();

    s2.changed.add(function (value) {
      try{
        expect(s1.getState()).to.be.deep.equal(s2.getState());
        done()
      }catch(e) {
        done(e)
      }
    })
  })

  it('should support dependencies between store - Generator', function(done) {
    let s1 = new Store({a:1}, 'test');
    s1.test.add( (state, args) => {
      return new Promise(function (resolve, reject) {
        setTimeout(function() { resolve({...state, ...args}) });
      })
    })

    let s2 = new Store({}, 'test');
    s2.test.add( (state, args) => {
      return function *(){
        const s1State = yield s1.test({foo:"bar"});
        return s1State;
      }();
    });

    s2.test();

    s2.changed.add(function (value) {
      try{
        expect(s1.getState()).to.be.deep.equal(s2.getState());
        done()
      }catch(e) {
        done(e)
      }
    })
  })

})

// describe('Command', function() {
//   it('should create a command', function() {
//     let s = new Store({}, 'test');
//     let c = new Command(s.test, (state, args) => { return {...state, ...args} })
//     expect(c).to.be.ok
//   })

//   it('should return a promise on execute', function(done) {
//     let c = new Command(new Signal('test'), (state, args) => { return {...state, ...args} })
//     let p = c.execute({foo:"bar"});
//     p.then((value)=> {
//       expect(value).to.be.deep.equal({foo:'bar'})
//       done()
//     })
//   })

//   it('should return uppercase', function(done){
//     const myStore = new Store({}, 'test');
//     new Command(myStore.test, (state, text) => {
//       return text.toUpperCase();
//     });

//     // invoke command
//     myStore.test('bob').then((upperText) => {
//       try{
//         expect(upperText).to.be.equals('BOB');
//         done();
//       }catch(e){
//         done(e);
//       }
//     });

//     // output: BOB;
//   })
// });

describe('Signal', function() {

  it('should process command when is dispatch', function(done) {
    let s = new Signal('test');
    s.add( test => {
      return test;
    })
    s.dispatch('test').then(value => {
      done()
    })
  })

  it('should generate a name when is not provided', function() {
    let s = new Signal();
    expect(s.name).to.not.be.null;
  })

  it('should remove a listener', function(){
    let s = new Signal('test');
    let fn = function(){};
    s.add(fn)
    expect(s.commands.has(fn)).to.be.true;
    s.remove(fn)
    expect(s.commands.has(fn)).to.be.false;
  })

  it('should not add an already added command', function(){
    let s = new Signal('test');
    let fn = function(){};
    s.add(fn)
    expect(s.commands.has(fn)).to.be.true;
    s.add(fn)
    expect(s.commands.size).to.be.equal(1);
  })

  it('should have response in then handler', function(done){
    function listener(text) {
      return new Promise((resolve) => setTimeout( ()=> resolve(text.toUpperCase())));
    }
    const upperCaseSignal = new Signal('uppercase');

    upperCaseSignal.add(listener);

    upperCaseSignal.dispatch('text')
      .then((result) => {
        try{
          expect(result).to.be.equals('TEXT');
          done();
        }catch(e) {
          done(e);
        }
      });
  })

});