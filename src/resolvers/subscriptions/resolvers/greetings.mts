import { ISubscriptionGreetingsArgs } from '@src/generated/schema.mjs';
import logger from '@utils/logger.mjs';

export const USER_STATUS_CHANGED_EVENT = 'USER_STATUS_CHANGED';

const userStatusChanged = {
  subscribe: async function* (
    payload: unknown,
    variables: ISubscriptionGreetingsArgs,
  ) {
    logger.info('In subscription handler:', payload, variables);

    for (const x of ['1', '2', '3', '4']) {
      logger.info('Yielding:', x);
      yield {
        greetings: x,
      };
    }
  },
};

export default userStatusChanged;
