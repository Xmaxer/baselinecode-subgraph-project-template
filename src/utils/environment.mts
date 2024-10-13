import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, process.env.ENV_FILE || '.env'),
});

const requiredEnvironmentVariables = ['SERVER_PORT', 'SERVER_HOST'];

requiredEnvironmentVariables.forEach((requiredEnvironmentVariable) => {
  if (!process.env[requiredEnvironmentVariable]) {
    throw new Error(
      `Missing required environment variable ${requiredEnvironmentVariable}`,
    );
  }
});

const Environment = {
  SERVER_PORT: parseInt(process.env.SERVER_PORT as string),
  SERVER_HOST: process.env.SERVER_HOST as string,
  NODE_ENV: (process.env.NODE_ENV as string) || 'production',
};

export default Environment;
