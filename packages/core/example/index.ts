import {Store, Signal, createStore} from '../src';

const store = createStore({status: false}, {
  add: (state, firstname, lastname, ...phones) => {
    return {...state, contacts : [...state.contacts, {
        firstname,
        lastname,
        phones
      }]}
  },
  checked: (state, value) => value
})

const contactStore = new Store({ contacts: [] }, 'add', 'remove', 'update');

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

const load = new Signal('load');
contactStore.addSignals(load);
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