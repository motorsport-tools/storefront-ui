import { gql } from "@apollo/client/core";
import { internalOrderFragment } from "../fragments/orderFragment";

export default gql`
  query ($currentPage: Int, $pageSize: Int, $sort: OrderSortInput) {
    orders(currentPage: $currentPage, pageSize: $pageSize, sort: $sort) {
      totalCount
      orders {
        ${internalOrderFragment}  
      }
    }
  }
`;
