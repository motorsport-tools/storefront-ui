import productFragment from '../fragments/productFragment';
export default `
query(
  $filter: ProductFilterInput
  $currentPage: Int
  $pageSize: Int = 0
  $search: String
  $sort: ProductSortInput
  $tag: String
) {
  products(
    filter: $filter
    currentPage: $currentPage
    pageSize: $pageSize
    search: $search
    sort: $sort
    tag: $tag
  ) {
    products {
      id
      sku
      firstVariant {
        id
        sku
      }
    }
  }
}
`;
