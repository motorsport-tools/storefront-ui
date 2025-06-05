export default `
  mutation ($providerId: Int!) {
    stripeProviderInfo(providerId: $providerId) {
      stripeProviderInfo
    }
  }
`;