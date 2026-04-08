export default `
  query($email: String!, $orderNumber: String!) {
    searchOrder(email: $email, orderNumber: $orderNumber) {
      model
      resId
      accessToken
      pid
    }
  }
`;
