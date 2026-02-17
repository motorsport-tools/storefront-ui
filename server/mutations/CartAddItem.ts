import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment'
import { orderLiteFragment } from "../fragments"
export default `
  mutation($products: [ProductInput]!){
    cartAddMultipleItems(products: $products){
      ${orderLiteFragment}
      ${frequentlyTogetherProductsFragment}
    }
  }
`;
