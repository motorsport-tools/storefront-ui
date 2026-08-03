export default `
  mutation ($providerId: Int!, $orderId: Int) {
    tradeCreditCreateTransaction(providerId: $providerId, orderId: $orderId) {
      transaction
    }
  }
`;