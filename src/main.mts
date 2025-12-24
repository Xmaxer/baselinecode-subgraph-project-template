import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import express from 'express';
import { useServer } from 'graphql-ws/use/ws';
import { GraphQLError } from 'graphql/error';
import http from 'http';
import { WebSocketServer } from 'ws';
import schema from '~schema/schema.mjs';
import Environment from '~utils/environment.mjs';
import logger from '~utils/logger.mjs';

import { ApolloServer } from '@apollo/server';
import { unwrapResolverError } from '@apollo/server/errors';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';

dayjs.extend(utc);

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
        logger.info({ ctx, message, args }, 'Received subscription request:');
      },
    },
    wsServer,
  );

  const server = new ApolloServer({
    schema: schema,
    introspection: Environment.GRAPHQL_INTROSPECTION_ENABLED,
    includeStacktraceInErrorResponses:
      Environment.GRAPHQL_INCLUDE_STACKTRACE_IN_ERROR_RESPONSES,
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
      logger.error(
        {
          error,
          formattedError,
          isGraphQLError,
        },
        'GraphQL error:',
      );

      //Only return obfuscated errors on non local dev environments
      if (!isGraphQLError && Environment.GRAPHQL_OBFUSCATE_NON_GRAPHQL_ERRORS) {
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
      logger.info(
        {
          query: req.body?.query,
          variables: req.body?.variables,
          timeTakenMs: end - start,
        },
        `Performance of full request execution:`,
      );
    };

    res.on('close', measure);

    next();
  });

  app.use(
    graphQlPath,
    cookieParser(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        logger.info(
          {
            body: req.body,
          },
          'Received ordinary request:',
        );
        return {};
      },
    }),
  );

  httpServer.listen({ port: Environment.SERVER_PORT }, () => {
    logger.info(
      `Server ready at http://localhost:${Environment.SERVER_PORT}${graphQlPath}`,
    );
  });
}

startServer();
