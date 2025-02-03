import { gql } from 'graphql-tag';

export const subscriptions = gql`
  type Subscription {
    greetings(type: String!): String!
  }
`;
