import Fastify from 'fastify';

export const fastify = Fastify({
  logger: process.env.NODE_ENV === 'production' ? false : true,
});
