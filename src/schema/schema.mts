import { applyMiddleware } from 'graphql-middleware';

import { applyDirectives } from '@directives/directives.mjs';
import { buildSubgraphSchema } from '@graphql-tools/federation';
import { mergeTypeDefs } from '@graphql-tools/merge';
import Middleware from '@middleware/middleware.mjs';
import resolvers from '@resolvers/resolvers.mjs';
import { mutations } from '@schema/schemaDefs/mutations.js';
import { queries } from '@schema/schemaDefs/queries.js';
import { subscriptions } from '@schema/schemaDefs/subscriptions.js';
import { types } from '@schema/schemaDefs/types.js';

const typeDefs = mergeTypeDefs([
  mutations,
  queries,
  types,
  // directives,
  subscriptions,
]);

let schema = buildSubgraphSchema({
  typeDefs: typeDefs,
  resolvers,
});

schema = applyMiddleware(schema, ...Middleware);
schema = applyDirectives(schema);

export default schema;
