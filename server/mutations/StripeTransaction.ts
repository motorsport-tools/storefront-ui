export default `
  mutation ($providerId: Int!, $tokenizationRequested: Boolean!, $isExpress: Boolean!) {
    stripeTransaction(providerId: $providerId, tokenizationRequested: $tokenizationRequested, isExpress: $isExpress) {
      transaction
    }
  }
`;