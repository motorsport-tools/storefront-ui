export default `
query($saleOrderId: Int!, $accessToken: String!, $amount: String!) {
    validate(saleOrderId: $saleOrderId, accessToken: $accessToken, amount: $amount) {
        isValid
        requiresLogin
        errorMessage
        saleOrder {
            id
            name
            amountTotal
            state
            partnerId
            partnerName
        }
        transaction {
            id
            reference
            amount
            state
            providerId
        }
    }
}
`