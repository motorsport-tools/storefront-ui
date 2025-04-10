import { gql } from "@apollo/client/core";
import { internalOrderFragment } from "../fragments/orderFragment";

export default gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        partner {
          id
          name
          street
          street2
          city
          state {
            id
            name
          }
          country {
            id
            name
          }
          email
          phone
        }
      }
      cart {
        ${internalOrderFragment}
      }
      wishlistItems {
        id
        product {
          id
          name
        }
      }
    }
  }
`;
