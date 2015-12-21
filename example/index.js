import {Store, Command} from '../index'

const contactStore = new Store({contacts:[]}, 'add', 'remove', 'update', 'load');

new Command(contactStore.add, (state, firstname, lastname, ...phones) => {
  return {...state, contacts : [...state.contacts, {
      firstname,
      lastname,
      phones
    }]}
})

new Command(contactStore.remove, (state, id) => {
  return {...state, contacts : [...state.contacts.slice(0, id), ...state.contacts.slice(id + 1)]}
})

new Command(contactStore.update, (state, id, contact) => {
  return {...state, contacts : [...state.contacts.slice(0, id), {...contact}, ...state.contacts.slice(id + 1)]}
})

new Command(contactStore.load, (state) => {
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