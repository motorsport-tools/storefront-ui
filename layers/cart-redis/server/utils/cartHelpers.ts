import type { AttributeValue, Cart, EasyshipRate, OrderLine, CustomProductWithStockFromRedis } from "~/graphql";

export async function hydrateCartWithStock(cart: Cart, websiteId = 1) {
    const productIds = cart?.order?.orderLines?.map((line: any) => line?.product?.id).filter(Boolean) || []
    const stockKeys = productIds.map((id: number) => `stock:product-${id}`)
    const stocks = productIds.length > 0 ? await useStorage('stock').getItems(stockKeys) : []

    for (const orderLine of cart?.order?.orderLines || []) {
        const stockId = `stock:product-${orderLine?.product?.id}`
        const stock = stocks.find((s: any) => s.key === stockId)?.value as any

        try {
            if (orderLine.product) {
                (orderLine.product as CustomProductWithStockFromRedis).stock = 0
                if (stock) {
                    (orderLine.product as CustomProductWithStockFromRedis).stock = Number(stock?.[websiteId]) || 0
                }
            }
        }
        catch (e) {
            console.log(e)
            console.log(stock)
        }
    }
    return cart
}

export const reduceCart = (cartData: Cart) => ({
    order: {
        id: cartData?.order?.id,
        amountTotal: cartData?.order?.amountTotal,
        amountTax: cartData?.order?.amountTax,
        amountDelivery: cartData?.order?.amountDelivery,
        amountSubtotal: cartData?.order?.amountSubtotal,
        amountDiscounts: cartData?.order?.amountDiscounts,
        amountGiftCards: cartData?.order?.amountGiftCards,
        shippingMethod: {
            id: cartData?.order?.shippingMethod?.id,
            name: cartData?.order?.shippingMethod?.name,
            price: cartData?.order?.shippingMethod?.price
        },
        shippingRate: cartData?.order?.shippingRate?.map((rate: EasyshipRate) => ({
            serviceId: rate.serviceId
        })),
        onlyServices: cartData?.order?.onlyServices,
        coupons: cartData?.order?.coupons,
        giftCards: cartData?.order?.giftCards,
        websiteOrderLine: cartData?.order?.websiteOrderLine?.map((line: OrderLine) => ({
            id: line?.id,
        })),
        orderLines: cartData?.order?.orderLines?.map((line: OrderLine) => ({
            id: line?.id,
            name: line?.product?.name,
            priceTotal: line?.priceTotal,
            priceSubtotal: line?.priceSubtotal,
            quantity: line?.quantity,
            coupon: line?.coupon,
            isDelivery: line?.isDelivery,
            isClickAndCollect: line?.isClickAndCollect,
            isRewardLine: line?.isRewardLine,
            isConfigurableProduct: line?.isConfigurableProduct,
            isService: line?.isService,
            product: {
                id: line?.product?.id,
                name: line?.product?.name,
                image: line?.product?.image,
                imageFilename: line?.product?.imageFilename,
                allowOutOfStock: line?.product?.allowOutOfStock,
                isInStock: line?.product?.isInStock,
                qty: line?.product?.qty,
                slug: line?.product?.slug,
                variantAttributeValues: line?.product?.variantAttributeValues?.map((attr: AttributeValue) => ({
                    id: attr?.id,
                    name: attr?.name,
                    attribute: {
                        id: attr?.attribute?.id,
                        name: attr?.attribute?.name
                    }
                })),
                combinationInfo: {
                    price: line?.product?.combinationInfo?.price,
                    list_price: line?.product?.combinationInfo?.list_price,
                    has_discounted_price: line?.product?.combinationInfo?.has_discounted_price,
                }

            }
        })),
    }
})

export async function updateCart(event: any, updateData: any) {
    const sessionId = getCookie(event, 'session_id');
    const keyName = `cache:cart:session:${sessionId}`
    const currentCart = (await useStorage('cart').getItem<{ cart: Cart }>(
        keyName
    )) || { cart: {} };

    const updatedCart = Object.assign({}, currentCart.cart, updateData);
    const reducedCart = reduceCart(updatedCart as Cart)
    useStorage('cart').setItem(keyName, { cart: reducedCart });
}