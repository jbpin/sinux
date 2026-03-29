---
sidebar_position: 2
---

# Contact Store

Async operations with store-to-store communication.

```typescript
import { createStore } from '@sinuxjs/core';

interface Contact { firstname: string; lastname: string; phones: string[]; }

const contactStore = createStore(
  { status: false, contacts: [] as Contact[] },
  {
    add: async (state, firstname: string, lastname: string, ...phones: string[]) => ({
      contacts: [...state.contacts, { firstname, lastname, phones }]
    }),
    remove: (state, index: number) => ({
      contacts: [...state.contacts.slice(0, index), ...state.contacts.slice(index + 1)]
    }),
    update: (state, index: number, contact: Contact) => ({
      contacts: [
        ...state.contacts.slice(0, index),
        contact,
        ...state.contacts.slice(index + 1)
      ]
    }),
    load: (state) => {
      return new Promise<Partial<typeof state>>((resolve) => {
        setTimeout(() => {
          resolve({
            status: true,
            contacts: [{ firstname: 'John', lastname: 'Doe', phones: ['555-0100'] }]
          });
        }, 1000);
      });
    },
  }
);

// Usage
await contactStore.load();
await contactStore.add('Jane', 'Smith', '555-0200');
contactStore.getState().contacts; // [John, Jane]
```

Demonstrates:

- Async signal handlers with Promises
- Multiple arguments per signal
- The [command pipeline](/docs/concepts/signals): add more handlers with `contactStore.add.add(handler)`
