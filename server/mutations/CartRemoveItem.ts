import orderFragment from "../fragments/orderFragment"
import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment'
export default `
  mutation($lineIds: [Int]!){
    cartRemoveMultipleItems(lineIds: $lineIds) {
      ${orderFragment}
      ${frequentlyTogetherProductsFragment}
    }
  }
`;
