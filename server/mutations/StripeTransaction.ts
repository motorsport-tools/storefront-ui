import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!, $tokenizationRequested: Boolean!) {
    stripeTransaction(providerId: $providerId, tokenizationRequested: $tokenizationRequested) {
      transaction
    }
  }
`;