import orderFragment from "../fragments/orderFragment";
export default `
mutation UpdatePartnerCheckoutAddress($type: AddressEnum!, $address: CheckoutAddressInput!) {
    updatePartnerCheckoutAddress(type: $type, address: $address) {
        ${orderFragment}
    }
}
`