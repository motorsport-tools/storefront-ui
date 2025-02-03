import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!) {
    rvvupProviderInfo(providerId: $providerId) {
      rvvupProviderInfo
    }
  }
`;
