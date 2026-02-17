import { internalOrderFragment } from "../fragments/orderFragment";
export default `
query ($id: Int!) {
  order(id: $id){
    id
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
    deliveryStatus
    effectiveDate
    orderUrl
    stage
    transactions {
      state
    }
    reportOrderLine {
      id
      name
      priceUnit
      priceSubtotal
      quantity
      priceTotal
      product {
        id
        name
        sku
        image
        imageFilename
        displayName
        slug
        variantAttributeValues{
          id
          name
          attribute{
            name
          }
        }
      }
    }
    orderLines {
      id
      name
      priceSubtotal
      quantity
      priceTotal
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
        sku
        image
        imageFilename
        displayName
        slug
        variantAttributeValues{
          id
          name
          attribute{
            name
          }
        }
      }
    }
    partnerInvoice {
      id
      name
      street
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
    }  
  } 
}
`;
