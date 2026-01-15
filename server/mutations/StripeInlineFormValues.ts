export default `
  mutation ($providerId: Int!, $pmCode: String!, $orderId: Int) {
    stripeGetInlineFormValues(providerId: $providerId, pmCode: $pmCode, orderId: $orderId) {
      stripeGetInlineFormValues
    }
  }
`;