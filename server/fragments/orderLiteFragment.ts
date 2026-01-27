const internalOrderLiteFragment = `id
name
amountTotal
amountTax
amountDelivery
amountSubtotal
amountDiscounts
amountGiftCards
onlyServices
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
orderUrl
stage
transactions {
  state
}
websiteOrderLine {
  id
  name
  priceSubtotal
  coupon {
    id
    code
    name
    programType
  }
  giftCard {
    id
    code
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
    allowOutOfStock
    isInStock
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
shippingMethod{
  id
  name
  price
}
shippingRate {
  serviceId
}
locked`;

export { internalOrderLiteFragment };

export default `
    order {
        ${internalOrderLiteFragment}
    }
`;
