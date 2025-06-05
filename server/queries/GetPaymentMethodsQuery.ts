export default `
  query {
    paymentProviders {
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
