import { orderFragment } from "../fragments";
import { gql } from "@apollo/client/core";

export default gql`
  query($accessToken: String!) {
    paymentConfirmation(accessToken: $accessToken) {
      ${orderFragment}
    }
  }
`;
