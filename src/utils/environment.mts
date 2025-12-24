import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, process.env.ENV_FILE || '.env'),
});

const requiredEnvironmentVariables: Array<string> = [];

requiredEnvironmentVariables.forEach((requiredEnvironmentVariable) => {
  if (!process.env[requiredEnvironmentVariable]) {
    throw new Error(
      `Missing required environment variable ${requiredEnvironmentVariable}`,
    );
  }
});

const Environment = {
  SERVER_PORT: parseInt((process.env.SERVER_PORT as string) || '3000'),
  SERVER_HOST: process.env.SERVER_HOST as string,
  GRAPHQL_OBFUSCATE_NON_GRAPHQL_ERRORS:
    (process.env.GRAPHQL_OBFUSCATE_NON_GRAPHQL_ERRORS as string) === 'true',
  GRAPHQL_INTROSPECTION_ENABLED:
    (process.env.GRAPHQL_INTROSPECTION_ENABLED as string) === 'true',
  GRAPHQL_INCLUDE_STACKTRACE_IN_ERROR_RESPONSES:
    (process.env.GRAPHQL_INCLUDE_STACKTRACE_IN_ERROR_RESPONSES as string) ===
    'true',
  LOGGER_PINO_PRETTY: (process.env.LOGGER_PINO_PRETTY as string) === 'true',
};

export default Environment;
