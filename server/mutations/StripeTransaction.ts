export default `
  mutation ($providerId: Int!, $tokenizationRequested: Boolean!, $isExpress: Boolean!, $orderId: Int) {
    stripeTransaction(providerId: $providerId, tokenizationRequested: $tokenizationRequested, isExpress: $isExpress, orderId: $orderId) {
      transaction
    }
  }
`;