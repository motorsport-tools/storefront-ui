export default `
mutation ($providerId: Int!, $orderId: Int) {
    tradeCreditTransaction(providerId: $providerId, orderId: $orderId) {
      eligible
      availableCredit
      warning
    }
  }
`