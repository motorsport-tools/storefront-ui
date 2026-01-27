import { AddressType, type Cart } from "~/graphql"
import { MutationName } from "~/server/mutations"
import { QueryName } from "~/server/queries"
import { updateCart, reduceCart } from "../utils/cartHelpers.js"

/**
 * This plugin is responsible for managing the cart cache.
 * It listens to the POST requests and updates the cart cache accordingly.
 * @cache store key example -> cart:255, the 255 is the odoo ID of the order
 */
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook("beforeResponse", async (event, { body }) => {
    if (event.method == "POST") {
      await cartAddItem(event, body)
      await cartRemoveItem(event, body)
      await cartUpdateItem(event, body)
      await updateAddress(event, body)
      await updateShipping(event, body)
      await setEasyshipRate(event, body)
      await addAddress(event, body)
      await createUpdatePartner(event, body)
      await applyCoupon(event, body)
      await applyGiftCard(event, body)
      await clearCartAfterCreditCardPaymentConfirmation(event, body)
      await clearCartAfterGiftCardPaymentConfirmation(event, body)
      await userLogin(event, body)
      await updatePartnerCheckoutAddress(event, body)
    }
  });
});

async function cartAddItem(event: any, body: any) {
  const requestBody = await readBody(event);

  if (requestBody[0]?.mutationName === MutationName.CartAddItem) {
    updateCart(event, body.cartAddMultipleItems)
  }
}

async function applyCoupon(event: any, body: any) {
  const requestBody = await readBody(event);

  if (requestBody[0]?.mutationName === MutationName.ApplyCouponMutation) {
    updateCart(event, body.applyCoupon)
  }
}

async function applyGiftCard(event: any, body: any) {
  const requestBody = await readBody(event);

  if (requestBody[0]?.mutationName === MutationName.ApplyGiftCardMutation) {
    updateCart(event, body.applyGiftCard)
  }
}

async function cartRemoveItem(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.CartRemoveItem) {
    updateCart(event, body.cartRemoveMultipleItems)
  }
}

async function cartUpdateItem(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.CartUpdateQuantity) {
    updateCart(event, body.cartUpdateMultipleItems)
  }
}

async function addAddress(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.AddAddress) {
    const sessionId = getCookie(event, 'session_id');

    const keyName = `cache:cart:session:${sessionId}`;
    const currentCart =
      (await useStorage('cart').getItem<{ cart: Cart }>(keyName)) || ({} as any);
    if (requestBody[1].type === "Shipping") {
      currentCart.cart.order.partnerShipping = body.addAddress
      currentCart.cart.order.partner.isPublic = body.addAddress?.isPublic || false
    } else {
      currentCart.cart.order.partnerInvoice = body.addAddress
      currentCart.cart.order.partner.isPublic = body.addAddress?.isPublic || false
    }

    const reducedCart = reduceCart(currentCart as Cart)
    await useStorage('cart').setItem(keyName, reducedCart);
  }
}

async function updateAddress(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.UpdateAddress) {
    const sessionId = getCookie(event, 'session_id');

    const keyName = `cache:cart:session:${sessionId}`;
    const currentCart =
      (await useStorage('cart').getItem<{ cart: Cart }>(keyName)) || ({} as any);

    if (body.updateAddress?.addressType === AddressType.DeliveryAddress) {
      currentCart.cart.order.partnerShipping = body.updateAddress
      currentCart.cart.order.partner.isPublic = body.updateAddress?.isPublic || false
    } else {
      currentCart.cart.order.partnerInvoice = body.updateAddress
      currentCart.cart.order.partner.isPublic = body.addAddress?.isPublic || false
    }

    const reducedCart = reduceCart(currentCart as Cart)
    await useStorage('cart').setItem(keyName, reducedCart);
  }
}

async function updateShipping(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.ShippingMethod) {
    updateCart(event, body.setShippingMethod)
  }
}

async function setEasyshipRate(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.CartSetEasyship) {
    updateCart(event, body.setRate)
  }
}

async function createUpdatePartner(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.CreateUpdatePartner) {
    const sessionId = getCookie(event, 'session_id');

    const keyName = `cache:cart:session:${sessionId}`
    const currentCart =
      (await useStorage('cart').getItem<{ cart: Cart }>(keyName)) || ({} as any);
    currentCart.cart.order.partner = body.createUpdatePartner;

    const reducedCart = reduceCart(currentCart.cart as Cart)

    await useStorage('cart').setItem(keyName, { cart: reducedCart });
  }
}

async function clearCartAfterCreditCardPaymentConfirmation(
  event: any,
  body: any
) {
  const requestBody = await readBody(event);

  const paymentSuccess =
    body?.paymentConfirmation?.order?.lastTransaction?.state === "Authorized" ||
    body.paymentConfirmation?.order?.lastTransaction?.state === "Confirmed";

  if (requestBody[0]?.queryName === QueryName.GetPaymentConfirmation) {
    const sessionId = getCookie(event, 'session_id');

    const keyName = `cache:cart:session:${sessionId}`
    if (paymentSuccess) {
      await useStorage('cart').removeItem(keyName)
    }
  }
}

async function clearCartAfterGiftCardPaymentConfirmation(
  event: any,
  body: any
) {
  const requestBody = await readBody(event)

  const paymentSuccess = body?.makeGiftCardPayment?.done;

  if (
    requestBody[0]?.mutationName === MutationName.MakeGiftCardPaymentMutation
  ) {
    const sessionId = getCookie(event, 'session_id');

    const keyName = `cache:cart:session:${sessionId}`
    if (paymentSuccess) {
      await useStorage('cart').removeItem(keyName)
    }
  }
}

async function userLogin(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.LoginMutation) {
    updateCart(event, { order: body.login.cart })
  }
}

async function updatePartnerCheckoutAddress(event: any, body: any) {
  const requestBody = await readBody(event);
  if (requestBody[0]?.mutationName === MutationName.UpdatePartnerCheckoutAddress) {
    updateCart(event, body.updatePartnerCheckoutAddress)
  }
}