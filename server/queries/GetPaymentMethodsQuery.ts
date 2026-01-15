export default `
  query ( $orderId: Int ) {
    paymentProviders(orderId: $orderId) {
      id
      name
      code
      paymentMethods {
        id
        name
        image
        code
        sequence
        brands {
          id
          name
          image
        }
      }
    }
  }
`;
