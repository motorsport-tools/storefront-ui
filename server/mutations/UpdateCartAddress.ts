import orderFragment from "../fragments/orderFragment";
export default `
    mutation UpdateCartAddress($addressType: String!, $address: AddressInput!, $useSameAddress: Boolean) {
        updateCartAddress(addressType: $addressType, address: $address,useSameAddress: $useSameAddress) {
            success
            error
            cart {
                ${orderFragment}
            }
        }
    }
`;
