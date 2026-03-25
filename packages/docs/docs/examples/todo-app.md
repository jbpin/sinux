---
sidebar_position: 1
---

# Todo App

Complete example: store + React components + persist.

```typescript
// store.ts
import { createStore, persist, devtools } from '@sinuxjs/core';

interface Todo { id: number; text: string; done: boolean; }
interface TodoState { todos: Todo[]; filter: 'all' | 'active' | 'done'; }

export const todoStore = createStore<TodoState, {
  addTodo: (state: TodoState, text: string) => Partial<TodoState>;
  toggleTodo: (state: TodoState, id: number) => Partial<TodoState>;
  removeTodo: (state: TodoState, id: number) => Partial<TodoState>;
  setFilter: (state: TodoState, filter: TodoState['filter']) => Partial<TodoState>;
}>(
  { todos: [], filter: 'all' },
  {
    addTodo: (state, text) => ({
      todos: [...state.todos, { id: Date.now(), text, done: false }]
    }),
    toggleTodo: (state, id) => ({
      todos: state.todos.map(t => t.id === id ? { ...t, done: !t.done } : t)
    }),
    removeTodo: (state, id) => ({
      todos: state.todos.filter(t => t.id !== id)
    }),
    setFilter: (state, filter) => ({ filter }),
  },
  [
    persist({ key: 'todos' }),
    devtools({ name: 'Todo Store' }),
  ]
);
```

```tsx
// App.tsx
import { useStore } from '@sinuxjs/react';
import { computed } from '@sinuxjs/core';
import { useComputed } from '@sinuxjs/react';
import { todoStore } from './store';

const filteredTodos = computed(todoStore, (s) => {
  if (s.filter === 'active') return s.todos.filter(t => !t.done);
  if (s.filter === 'done') return s.todos.filter(t => t.done);
  return s.todos;
});

function TodoApp() {
  const todos = useComputed(filteredTodos);
  const { filter } = useStore(todoStore, s => ({ filter: s.filter }));

  return (
    <div>
      <input onKeyDown={(e) => {
        if (e.key === 'Enter') {
          todoStore.addTodo(e.currentTarget.value);
          e.currentTarget.value = '';
        }
      }} placeholder="Add todo..." />

      <div>
        {['all', 'active', 'done'].map(f => (
          <button key={f} onClick={() => todoStore.setFilter(f as any)}
            style={{ fontWeight: filter === f ? 'bold' : 'normal' }}>
            {f}
          </button>
        ))}
      </div>

      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <span onClick={() => todoStore.toggleTodo(t.id)}
              style={{ textDecoration: t.done ? 'line-through' : 'none' }}>
              {t.text}
            </span>
            <button onClick={() => todoStore.removeTodo(t.id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
