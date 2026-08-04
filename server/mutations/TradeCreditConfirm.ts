export default `
mutation ($order_id: Int!) {
    tradeCreditConfirmTransaction(orderId: $order_id) {
      success
      redirectUrl
    }
  }
`