export default `
  mutation (
    $providerId: Int!
    $accessToken: String!
    $browserInfo: GenericScalar!
    $paymentMethod: GenericScalar!
    $transactionReference: String!
  ) {
    rvvupPayments(
      providerId: $providerId
      accessToken: $accessToken
      browserInfo: $browserInfo
      paymentMethod: $paymentMethod
      transactionReference: $transactionReference
    ) {
      rvvupPayments
    }
  }
`;
