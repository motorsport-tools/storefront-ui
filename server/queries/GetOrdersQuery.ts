import { internalOrderFragment } from "../fragments/orderFragment";
export default `
  query ($currentPage: Int, $pageSize: Int, $sort: OrderSortInput) {
    orders(currentPage: $currentPage, pageSize: $pageSize, sort: $sort) {
      totalCount
      orders {
        ${internalOrderFragment}  
      }
    }
  }
`;
