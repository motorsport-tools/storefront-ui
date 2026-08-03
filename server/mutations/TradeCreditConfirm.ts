export default `
mutation ($reference: String!) {
    tradeCreditConfirmTransaction(reference: $reference) {
      success
      redirectUrl
    }
  }
`