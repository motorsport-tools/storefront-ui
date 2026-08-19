import productFragment from '../fragments/productFragment';
import alternativeProductsFragment from '../fragments/alternativeProductsFragment';
import frequentlyTogetherProductsFragment from '../fragments/frequentlyTogetherProductsFragment';

export default `
  query(
    $id: Int = null
    $slug: String = null
    $barcode: String = null
  ) {
    product(
      id: $id
      slug: $slug
      barcode: $barcode
    ) {
        ${productFragment}
        ${alternativeProductsFragment}
        ${frequentlyTogetherProductsFragment}
    }
  }
`;
