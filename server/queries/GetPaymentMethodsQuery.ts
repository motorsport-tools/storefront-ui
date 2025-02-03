import { gql } from "@apollo/client/core";

export default gql`
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
