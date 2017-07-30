import {Store} from '../index'

const contactStore = new Store({contacts:[]}, 'add', 'remove', 'update', 'load');

contactStore.add.add( (state, firstname, lastname, ...phones) => {
  return {...state, contacts : [...state.contacts, {
      firstname,
      lastname,
      phones
    }]}
});

contactStore.remove.add( (state, id) => {
  return {...state, contacts : [...state.contacts.slice(0, id), ...state.contacts.slice(id + 1)]}
})

contactStore.update.add( (state, id, contact) => {
  return {...state, contacts : [...state.contacts.slice(0, id), {...contact}, ...state.contacts.slice(id + 1)]}
})

contactStore.load.add( (state) => {
  var dummyData = {
    contacts: [
      {firstname: 'loaded', lastname: 'contact', phones : ['1234']}
    ]
  }
  return new Promise((resolve, reject) => {
    setTimeout(()=> resolve({...state, contacts : [...state.contacts, ...dummyData.contacts]}), 1000)
  })
})

export default contactStore;