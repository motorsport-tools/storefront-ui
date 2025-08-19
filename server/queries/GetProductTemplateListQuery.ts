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
    totalCount
    filterCounts
    attributeValues {
      id
      name
      displayType
      name
      htmlColor
      search
      attribute{
        id
        name
      }
      
    }
    products {
      ${productFragment}
    }
  }
}
`;
