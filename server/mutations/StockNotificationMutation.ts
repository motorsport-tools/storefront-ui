export default `
  mutation stockNotification($email: String!, $productId: Int!) {
    stockNotification(email: $email, productId: $productId) {
      subscribed
    }
  }
`;
