import { gql } from 'graphql-tag';

export const mutations = gql`
  type Mutation {
    doSomething: String!
  }
`;
