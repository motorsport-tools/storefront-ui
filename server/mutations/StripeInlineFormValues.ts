export default `
  mutation ($providerId: Int!, $pmCode: String!) {
    stripeGetInlineFormValues(providerId: $providerId, pmCode: $pmCode) {
      stripeGetInlineFormValues
    }
  }
`;