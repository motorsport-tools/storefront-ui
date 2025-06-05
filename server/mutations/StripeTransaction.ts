import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!, $tokenizationRequested: Boolean!, $isExpress: Boolean!) {
    stripeTransaction(providerId: $providerId, tokenizationRequested: $tokenizationRequested, isExpress: $isExpress) {
      transaction
    }
  }
`;