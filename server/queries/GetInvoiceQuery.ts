import { internalInvoiceFragment } from "../fragments/invoiceFragment";
export default `
query ($id: Int!, $token: String) {
  invoice(id: $id, token: $token){
    ${internalInvoiceFragment}  
  } 
}
`;
