import gql from "graphql-tag";

export default gql`
  mutation (
    $providerId: Int!
    $paymentDetails: GenericScalar!
    $transactionReference: String!
  ) {
    rvvupPaymentDetails(
      providerId: $providerId
      paymentDetails: $paymentDetails
      transactionReference: $transactionReference
    ) {
      rvvupPaymentDetails
    }
  }
`;
