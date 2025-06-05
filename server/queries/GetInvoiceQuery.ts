import { internalInvoiceFragment } from "../fragments/invoiceFragment";
export default `
query ($id: Int!) {
  invoice(id: $id){
    ${internalInvoiceFragment}  
  } 
}
`;
