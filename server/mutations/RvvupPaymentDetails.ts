export default `
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
