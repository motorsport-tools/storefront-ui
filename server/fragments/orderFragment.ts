const internalOrderFragment = `id
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
reportOrderLine {
  id
  name
  priceUnit
  priceSubtotal
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
partnerInvoice {
  id
  name
  street
  street2
  city
  phone
  zip
  country {
    id
    name
  }
  state {
    id
    name
  }
  addressType
}
partnerShipping {
  id
  name
  street
  street2
  city
  phone
  zip
  country {
    id
    name
  }
  state { 
    id
    name
  }
  addressType
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
  email
  name
  phone
  country {
    id
    name
    code
  }
  vat
  isPublic
}
locked
invoiceIds{
  id
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
  }
}
lastTransaction{
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

export { internalOrderFragment };

export default `
    order{
        ${internalOrderFragment}
    }
`;
