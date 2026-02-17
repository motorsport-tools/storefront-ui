export default `
  mutation ($operationId: Int!, $orderId: Int!, $productId: Int!, $qty: Float, $accessToken: String, $description: String) {
    createRma(operationId: $operationId, orderId: $orderId, productId: $productId, qty: $qty, accessToken: $accessToken, description: $description) {
      id
      name
      state
    }
  }
`;
