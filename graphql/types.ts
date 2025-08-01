import type {
  AttributeValue,
  Cart,
  Category,
  Partner,
  Product,
  ProductVariant,
  WishlistData,
  Country,
  ShippingMethod,
  EasyShipRates,
  PaymentProvider,
  StripeProviderInfoResult,
  Orders,
  Order,
  Invoice,
  Countries,
  AddressEnum,
  State,
  User,
  WishlistItem,
  StripeGetInlineFormValuesResult,
  StripeTransactionResult,
  ApplyCouponList,
  ApplyGiftCardList,
  OrderLine,
} from "./gql/graphql";
import type { H3Error } from "h3";
import type { AsyncData } from "#app";

export type CategoryListResponse =
  {
    categories: {
      categories: Category[];
      totalCount: number;
    }
  }

export type ImageGalleryItem = 
  {
    id: number
    url: string
    alt: string
    width?: number | string
    height?: number | string
  }

export type CategoryResponse = {
  category: Category
}

export type ProductTemplateListResponse = {
  products: {
    attributeValues: AttributeValue[]
    maxPrice?: number
    minPrice?: number
    totalCount: number
    filterCounts: any[]
    products: Product[]
  }
}

export type ProductResponse = {
  product: Product
}

export type ProductVariantResponse = {
  product: CustomProductWithStockFromRedis
}

export type WishlistLoadResponse = AsyncData<
  {
    wishlistItems: WishlistData;
  },
  H3Error
>;

export type WishlistAddItemResponse = AsyncData<
  {
    wishlistAddItem: WishlistData;
  },
  H3Error
>;

export type WishlistRemoveItemResponse = AsyncData<
  {
    wishlistRemoveItem: WishlistData;
  },
  H3Error
>;

export type CartResponse = AsyncData<
  {
    cart: Cart;
  },
  H3Error
>;

export type CartAddItemResponse =
  {
    cartAddMultipleItems: Cart
  }

export type setShippingMethodResponse = AsyncData<
  {
    setShippingMethod: Cart
  },
  H3Error
>;

export type SetRateCartResponse = AsyncData<
  {
    setRate: Cart
  },
  H3Error
>;

export type ApplyDiscountsResponse = AsyncData<
  {
    applyGiftCard: ApplyGiftCardList
    applyCoupon: ApplyCouponList
  },
  H3Error
>;
export type MakeGiftCardPaymentResponse = AsyncData<
  {
    makeGiftCardPayment: { done: Boolean };
  },
  H3Error
>;
export type CartUpdateItemResponse = 
  {
    cartUpdateMultipleItems: Cart
  }

export type CartRemoveItemResponse = 
  {
    cartRemoveMultipleItems: Cart
  }

export type LoadUserQueryResponse = AsyncData<
  {
    partner: Partner;
  },
  H3Error
>;

export type RegisterUserResponse = AsyncData<
  {
    id: number;
    name: string;
    email: string;
    partner: Partner;
  },
  H3Error
>;

export type LoginResponse = AsyncData<
  {
    login: {
      cart: Cart;
      user: User;
      wishlistItems: WishlistData;
    };
  },
  H3Error
>;

export type SignUpUserResponse = {
  register: {
    id: number
    name: string
    email: string
    partner: Partner
  }
}

export type SignInUserResponse = {
  login: {
    user: User
  }
}

export type LoginUserResponse = AsyncData<
  {
    login: {
      partner: Partner;
    };
  },
  H3Error
>;

export type ResetPasswordResponse = AsyncData<
  {
    id: number;
    name: string;
    email: string;
  },
  H3Error
>;

export type PartnerResponse = AsyncData<Partner, H3Error>;

export type AddressesResponse = AsyncData<
  {
    addresses: Partner[];
  },
  H3Error
>;

export type responseAddresses = {
  addresses: Partner[]
}

export type AddAddressResponse = AsyncData<
  {
    addAddress: Partner;
  },
  H3Error
>;

export type UpdatePasswordResponse = AsyncData<
  {
    updatePassword: {
      id: number;
    };
  },
  H3Error
>;

export type ChangePasswordResponse = AsyncData<
  {
    changePassword: User;
  },
  H3Error
>;

export type UpdateMyAccountResponse = AsyncData<
  {
    updateMyAccount: Partner;
  },
  H3Error
>;

export type CreateUpdatePartnerResponse = AsyncData<
  {
    createUpdatePartner: Partner;
  },
  H3Error
>;

export type UpdateAddressResponse = AsyncData<
  {
    updateAddress: Partner;
  },
  H3Error
>;

export type SelectCurrentAddressResponse = AsyncData<
  {
    selectAddress: Partner;
  },
  H3Error
>;

export type DeleteAddressResponse = AsyncData<
  {
    result: boolean;
  },
  H3Error
>;

export type AddressFormFieldsInput = {
  street: string;
  street2?: string;
  countryId: number;
  city: string;
  stateId: number;
  zip: string;
};

export type AddressFormFieldsInputExtendedFields = AddressFormFieldsInput & {
  id?: number;
  name: string;
  phone: string;
  email?: string;
};

export type CountriesResponse = AsyncData<
  {
    countries: Countries[];
  },
  H3Error
>;

export type StatesResponse = AsyncData<
  {
    country: Country;
  },
  H3Error
>;

export type DeliveryMethodListResponse = AsyncData<
  {
    deliveryMethods: ShippingMethod[];
  },
  H3Error
>;

export type EasyShipRatesResponse = AsyncData<{
  rates: EasyShipRates[];
},
  H3Error
>;

export type DeliveryMethodResponse = AsyncData<
  {
    deliveryMethodId: number;
  },
  H3Error
>;

export type WebsiteHomepageResponse = 
  {
    metaTitle: String;
    metaImage: String;
    metaImageFilename: String;
    metaKeyword: String;
    metaDescription: String;
    jsonLd: String;
  }

export type PaymentMethodListResponse = AsyncData<
  {
    paymentProviders: PaymentProvider[];
    //paymentMethods: PaymentMethod[];
  },
  H3Error
>;

export type GetOrdersResponse = AsyncData<
  {
    orders: Orders;
  },
  H3Error
>;

export type GetOrderResponse = AsyncData<
  {
    order: Order;
  },
  H3Error
>;

export type GetInvoiceResponse = AsyncData<
  {
    invoice: Invoice;
  },
  H3Error
>;

export type NewsletterSubscribeResponse = AsyncData<
  {
    newsletterSubscribe: boolean;
  },
  H3Error
>;

export interface AttributeFacet {
  id: string
  label: string
  attributeName: string
  options: OrganizedAttribute[]
  open?: boolean
  type?: string
  size?: number
  search?: string
}
export interface OrganizedAttribute {
  id: string
  value: number
  label: string
  htmlColor: string
  total?: number
}

export type CustomProductWithStockFromRedis = Product & {
  stock: number
}

export type CustomOrderLineWithStockFromRedis = OrderLine & {
  product: CustomProductWithStockFromRedis
}

/* Stripe */

export type StripeProviderInfoResponse = AsyncData<
  {
    stripeProviderInfo: StripeProviderInfoResult
  },
  H3Error
>

export type StripeGetInlineFormValueResponse = AsyncData<
  {
    stripeGetInlineFormValues: StripeGetInlineFormValuesResult
  },
  H3Error
>

export type StripeTransactionResponse = AsyncData<
  {
    stripeTransaction: StripeTransactionResult
  },
  H3Error
>