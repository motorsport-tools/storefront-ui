import { orderFragment } from "../fragments";
export default `
  query($accessToken: String!) {
    paymentConfirmation(accessToken: $accessToken) {
      ${orderFragment}
    }
  }
`;
