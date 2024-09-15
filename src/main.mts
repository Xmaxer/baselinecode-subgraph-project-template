import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import http from 'http';
import { WebSocketServer } from 'ws';

import { ApolloServer } from '@apollo/server';
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
        logger.info(req.body, 'Received ordinary request:');
        return {};
      },
    }),
  );

  httpServer.listen({ port: Environment.SERVER_PORT }, () => {
    logger.info(
      `Server ready at ${graphQlPath} on port ${Environment.SERVER_PORT}`,
    );
  });
}

startServer();
