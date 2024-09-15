import { GraphQLSchema } from 'graphql/type/index.js';

import { mapSchema } from '@graphql-tools/utils';

type CustomerDirectiveFn = (
  schema: GraphQLSchema,
  directiveName: string,
) => ReturnType<typeof mapSchema>;

interface ICustomDirective {
  name: string;
  transformer: CustomerDirectiveFn;
}

const CustomDirectives: Array<ICustomDirective> = [];

export function applyDirectives(schema: GraphQLSchema) {
  CustomDirectives.forEach((directive) => {
    schema = directive.transformer(schema, directive.name);
  });
  return schema;
}
