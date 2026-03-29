import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Concepts',
      items: ['concepts/store', 'concepts/signals', 'concepts/middleware', 'concepts/computed'],
    },
    {
      type: 'category',
      label: 'React',
      items: ['react/use-store', 'react/use-computed', 'react/combine'],
    },
    {
      type: 'category',
      label: 'Middlewares',
      items: ['middlewares/persist', 'middlewares/devtools', 'middlewares/immer'],
    },
    {
      type: 'category',
      label: 'Integrations',
      items: ['integrations/tanstack-query', 'integrations/apollo'],
    },
    {
      type: 'category',
      label: 'Examples',
      items: ['examples/todo-app', 'examples/contact-store', 'examples/multi-store'],
    },
    'skills',
  ],
};

export default sidebars;
