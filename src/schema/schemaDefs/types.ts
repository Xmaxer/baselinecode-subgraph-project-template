import { gql } from 'graphql-tag';

export const types = gql`
  type MyReturnType @key(fields: "id") {
    id: ID!
    name: String!
  }
`;
