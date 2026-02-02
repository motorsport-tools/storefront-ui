import { internalOrderFragment } from "../fragments/orderFragment";
import { internalOrderLiteFragment } from '../fragments/orderLiteFragment';
export default `
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        partner {
          id
          isPublic
          publicPricelist {
            id
          }
          currentPricelist {
            id
          }
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
        ${internalOrderLiteFragment}
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
