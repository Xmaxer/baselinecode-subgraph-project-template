import { gql } from 'graphql-tag';

export const types = gql`
  type MyReturnType {
    id: ID!
    name: String!
  }
`;
