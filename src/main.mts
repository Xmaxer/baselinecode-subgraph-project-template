import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import express from 'express';
import { useServer } from 'graphql-ws/use/ws';
import { GraphQLError } from 'graphql/error';
import http from 'http';
import { WebSocketServer } from 'ws';

import { ApolloServer } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import schema from '@schema/schema.mjs';
import Environment from '@utils/environment.mjs';
import logger from '@utils/logger.mjs';

dayjs.extend(utc);
const corsOrigins = [];

if (Environment.NODE_ENV === 'local') {
  corsOrigins.push('http://localhost:5173');
}

const corsPolicy = {
  credentials: true,
  origin: corsOrigins,
};

const graphQlPath = '/graphql';

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: graphQlPath,
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx, message, args) => {
        logger.info('Received subscription request:', ctx, message, args);
      },
    },
    wsServer,
  );

  const server = new ApolloServer({
    schema: schema,
    introspection: Environment.NODE_ENV === 'local',
    includeStacktraceInErrorResponses: Environment.NODE_ENV === 'local',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    formatError: (formattedError, error) => {
      const isGraphQLError = unwrapResolverError(error) instanceof GraphQLError;
      logger.error('GraphQL error:', {
        error,
        formattedError,
        isGraphQLError,
      });

      //Only return obfuscated errors on non local dev environments
      if (!isGraphQLError && Environment.NODE_ENV !== 'local') {
        return { message: 'Internal server error' };
      }
      return formattedError;
    },
  });

  await server.start();

  app.get('/health', (req, res) => {
    res.status(200).send('Okay!');
  });

  app.use((req, res, next) => {
    const start = performance.now();

    const measure = () => {
      const end = performance.now();
      logger.info(`Performance of full request execution:`, {
        query: req.body?.query,
        variables: req.body?.variables,
        timeTakenMs: end - start,
      });
    };

    res.on('close', measure);

    next();
  });

  app.use(
    graphQlPath,
    cookieParser(),
    cors(corsPolicy),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        logger.info('Received ordinary request:', {
          body: req.body,
        });
        return {};
      },
    }),
  );

  httpServer.listen(
    { port: Environment.SERVER_PORT, host: Environment.SERVER_HOST },
    () => {
      logger.info(
        `Server ready at ${Environment.SERVER_HOST}:${Environment.SERVER_PORT}${graphQlPath}`,
      );
    },
  );
}

startServer();
