import { orderLiteFragment } from "../fragments"
import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment'
export default `
  mutation($lineIds: [Int]!){
    cartRemoveMultipleItems(lineIds: $lineIds) {
      ${orderLiteFragment}
      ${frequentlyTogetherProductsFragment}
    }
  }
`;
