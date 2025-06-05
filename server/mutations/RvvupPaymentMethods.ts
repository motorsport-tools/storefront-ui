export default `
  mutation ($providerId: Int!, $partnerId: Int!, $amount: Float!, $pmCode: String!) {
    rvvupPaymentMethods(providerId: $providerId, partnerId: $partnerId, amount: $amount, pmCode: $pmCode) {
      rvvupPaymentMethods
    }
  }
`;
