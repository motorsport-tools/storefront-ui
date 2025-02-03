const internalInvoiceFragment = `id
  name
  state
  invoiceUrl
  invoiceDate
  amountTotal
  paymentState
  transactions{
    id
    reference
    payment{
      id
      name
      amount
      paymentReference
    }
    amount
    currency{
      id
      name
      symbol
    }
    provider
    providerReference
    state
  }`;

  export { internalInvoiceFragment }

  export default `
    invoice{
        ${internalInvoiceFragment}
    }
  `