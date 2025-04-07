import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!) {
    stripeProviderInfo(providerId: $providerId) {
      stripeProviderInfo
    }
  }
`;