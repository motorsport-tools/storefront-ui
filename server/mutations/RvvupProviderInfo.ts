export default `
  mutation ($providerId: Int!) {
    rvvupProviderInfo(providerId: $providerId) {
      rvvupProviderInfo
    }
  }
`;
