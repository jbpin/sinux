import {createStore} from '../src';

interface ContactStoreState {
  status: boolean,
  contacts?: [],
}

const store = createStore(
  {status: false},
  {
    add: (state, firstname: string, lastname: string, ...phones: string[]) => {
      return {...state, contacts : [...state.contacts, {
          firstname,
          lastname,
          phones
        }]}
    },
    checked: (state, value) => value,
  }
);

const contactStore = createStore<ContactStoreState, ['add', 'remove', 'update', 'load']>({ status: false, contacts: [] }, ['add', 'remove', 'update', 'load']);
contactStore.add.add( async (state, firstname, lastname, ...phones) => {
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