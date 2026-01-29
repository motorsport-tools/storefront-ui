import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment'
import orderLiteFragment from "../fragments/orderLiteFragment";
export default `
  mutation($accessToken: String!, $revive: ReviveEnum!){
    restoreCart(accessToken: $accessToken, revive: $revive){
      ${orderLiteFragment}
      ${frequentlyTogetherProductsFragment}
    }
  }
`;
