import contactStore from '../packages/core/example/index.js'
import Signal from '../src/signal'
import Store from '../src/store'
import {expect} from 'chai'

describe('Contact exemple', function() {
  it('should have a store', function(){
    expect(contactStore.getState()).to.be.ok;
  })

  it('should add a contact', function(done){
    contactStore.add('test', 'test', '1234').then(function(){
      try{
        expect(contactStore.getState()).to.be.deep.equal({
          contacts : [
            { firstname: 'test', lastname : 'test', phones: ['1234'] }
          ]
        })
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should add another contact', function(done){
    contactStore.add('test2', 'test2', '1234').then(function(){
      try{
        expect(contactStore.getState()).to.be.deep.equal({
          contacts : [
            { firstname: 'test', lastname : 'test', phones: ['1234']},
            { firstname: 'test2', lastname : 'test2', phones: ['1234']}
          ]
        })
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should remove a contact', function(done) {
    contactStore.remove(0).then(function(){
      try{
        expect(contactStore.getState()).to.be.deep.equal({
          contacts : [
            { firstname: 'test2', lastname : 'test2', phones: ['1234']}
          ]
        })
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should update a contact', function(done) {
    const contact = {
      firstname : 'update',
      lastname : 'test',
      phones : ['1234']
    }
    contactStore.update(0, contact).then(function(){
      try{
        expect(contactStore.getState()).to.be.deep.equal({
          contacts : [{...contact}]
        })
        done()
      }catch(e){
        done(e)
      }
    })
  })

  it('should load contact asynchronously', function(done) {
    const expectData = {
      contacts: [
        {firstname: 'loaded', lastname: 'contact', phones : ['1234']}
      ]
    }
    contactStore.load().then(function(){
      try{
        expect(contactStore.getState()).to.be.deep.equal({
          contacts: [
          { firstname : 'update', lastname : 'test', phones : ['1234']},
          ...expectData.contacts
          ]
        })
        done()
      }catch(e){
        done(e)
      }
    })
  })
});