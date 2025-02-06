import { gql } from "@apollo/client/core";

import { internalInvoiceFragment } from "../fragments/invoiceFragment";

export default gql`
query ($id: Int!) {
  invoice(id: $id){
    ${internalInvoiceFragment}  
  } 
}
`;
