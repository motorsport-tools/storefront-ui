import { gql } from "@apollo/client/core";

export default gql`
    query($orderId: ID!, $carrierId: ID!) {
        rates(orderId: $orderId, carrierId: $carrierId) {
            courierName
            shipmentCharge
            deliveryDays
            currencyId
            totalCharge
            carrierId
            courierId
        }
    }
`;