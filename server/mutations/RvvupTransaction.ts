import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!, $checkoutId: String!, $tokenizationRequested: Boolean = false) {
    rvvupTransaction(
      providerId: $providerId
      checkoutId: $checkoutId
      tokenizationRequested: $tokenizationRequested
    ) {
      transaction
    }
  }
`;
