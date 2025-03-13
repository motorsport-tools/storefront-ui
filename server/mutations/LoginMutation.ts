import { gql } from "@apollo/client/core";
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
        id
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
