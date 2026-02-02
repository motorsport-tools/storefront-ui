import { orderLiteFragment } from "../fragments"
import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment'
export default `
mutation($lines: [CartLineInput]!){
  cartUpdateMultipleItems(lines: $lines) {
      ${orderLiteFragment}
      ${frequentlyTogetherProductsFragment}
    }
  }
`;
