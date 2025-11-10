import type {
  CustomProductWithStockFromRedis,
  ProductVariantResponse,
  QueryProductVariantArgs,
} from "~/graphql";
import { QueryName } from "~/server/queries";

export const useProductVariant = (slugWithCombinationIds: string) => {
  const { $sdk } = useNuxtApp();

  const loadingProductVariant = ref(false);
  const productVariant = useState<CustomProductWithStockFromRedis>(`product-variant-${slugWithCombinationIds}`, () => ({}) as CustomProductWithStockFromRedis)

  const loadProductVariant = async (params: QueryProductVariantArgs) => {
    loadingProductVariant.value = true
    const { data, status } = await useAsyncData(`product-variant-${slugWithCombinationIds}`, () =>
      $sdk().odoo.query<QueryProductVariantArgs, ProductVariantResponse>(
        { queryName: QueryName.GetProductVariantQuery }, params),
      { server: true, lazy: import.meta.client }
    )

    if (data.value?.productVariant?.product) {
      productVariant.value = (data?.value?.productVariant?.product) || {} as CustomProductWithStockFromRedis
      loadingProductVariant.value = false
    }

    watch(status, () => {
      if (status.value === 'pending') {
        loadingProductVariant.value = true
      }
      if (status.value === 'error' && !data.value?.productVariant.product) {
        loadingProductVariant.value = false
        showError({
          status: 404,
          message: 'Product not found - Variant Error',
        })
      }
      if (status.value === 'success') {
        loadingProductVariant.value = false
        productVariant.value
          = (data?.value?.productVariant?.product as CustomProductWithStockFromRedis) || {}
      }
    })
  }

  const getRegularPrice = computed(
    () =>
      productVariant.value?.combinationInfoVariant?.list_price ||
      productVariant.value?.combinationInfo?.list_price ||
      0
  );
  const getSpecialPrice = computed(
    () =>
      productVariant.value?.combinationInfoVariant?.price ||
      0
  );

  return {
    loadingProductVariant,
    productVariant,
    getRegularPrice,
    getSpecialPrice,
    loadProductVariant,
  };
};
