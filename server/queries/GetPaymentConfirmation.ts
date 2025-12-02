import { orderFragment } from "../fragments";
export default `
  query($accessToken: String!) {
    paymentConfirmation(accessToken: $accessToken) {
      order {
        id
        name
        lastTransaction{
          state
        }
        partner {
          id
          email
        } 
        orderLines {
          id
          quantity
          product {
            id
            price
          }
        }
      }
    }
  }
`;
