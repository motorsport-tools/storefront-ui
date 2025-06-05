export default `
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
