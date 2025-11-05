const loadCartFragment = `id
name
amountTotal
amountTax
amountDelivery
amountSubtotal
amountDiscounts
amountGiftCards
coupons {
  id
  code
  name
  programType
}
giftCards {
  id
  code
}
dateOrder
orderLines {
  id
  name
  priceSubtotal
  isClickAndCollect
  isDelivery
  isRewardLine
  isConfigurableProduct
  isService
  coupon {
    id
    code
    name
    programType
  }
  product {
    id
    name
    image
    imageFilename
    displayName
    combinationInfo
    slug
    variantAttributeValues{
      id
      name
      attribute{
        name
      }
    }
  }
  quantity
  priceTotal
}
partnerInvoice {
  id
  isPublic
}
partnerShipping {
  id
  isPublic
}
shippingMethod{
  id
  name
  price
}
shippingRate {
  serviceId
}
partner {
  id
  isPublic
}
`;

export { loadCartFragment };

export default `
    order{
        ${loadCartFragment}
    }
`;
