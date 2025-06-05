export default `
    query($orderId: ID!, $carrierId: ID!) {
        rates(orderId: $orderId, carrierId: $carrierId) {
            courierName
            shipmentCharge
            deliveryDays
            maxDeliveryTime
            minDeliveryTime
            currencyId
            totalCharge
            serviceId
            courierId
            courierLogoUrl
        }
    }
`;