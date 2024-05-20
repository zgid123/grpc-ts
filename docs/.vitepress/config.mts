import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '@grpc.ts',
  description: 'A wrapper of @grpc/grpc-js for a better typings.',
  srcDir: './src',
  base: '/grpc-ts/',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/introduction/what-is-it',
      },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [
          {
            text: 'What is @grpc.ts?',
            link: '/introduction/what-is-it',
          },
          {
            text: 'Getting Started',
            link: '/introduction/getting-started',
          },
        ],
      },
      {
        text: 'CLI',
        link: '/cli',
      },
      {
        text: 'Integration',
        items: [
          {
            text: 'NestJS',
            link: '/integration/nestjs',
          },
          {
            text: 'Fastify',
            link: '/integration/fastify',
          },
        ],
      },
      {
        text: 'API Reference',
        link: '/api-reference',
      },
      {
        text: 'Changelogs',
        link: '/changelogs',
      },
    ],
    outline: {
      level: 'deep',
      label: 'On this page',
    },
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zgid123/grpc-ts' },
    ],
  },
});
