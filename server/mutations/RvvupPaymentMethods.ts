import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!) {
    rvvupPaymentMethods(providerId: $providerId) {
      rvvupPaymentMethods
    }
  }
`;
