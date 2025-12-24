import Fields from '~resolvers/fields/fields.mjs';
import Mutations from '~resolvers/mutations/mutations.mjs';
import Queries from '~resolvers/queries/queries.mjs';
import Subscriptions from '~resolvers/subscriptions/subscriptions.mjs';
import Scalars from '~scalars/scalars.mjs';

const resolvers = {
  ...Queries,
  ...Mutations,
  ...Subscriptions,
  ...Scalars,
  ...Fields,
};

export default resolvers;
