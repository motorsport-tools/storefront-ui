import orderFragment from "../fragments/orderFragment"
import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment'
export default `
mutation($lines: [CartLineInput]!){
  cartUpdateMultipleItems(lines: $lines) {
      ${orderFragment}
      ${frequentlyTogetherProductsFragment}
    }
  }
`;
