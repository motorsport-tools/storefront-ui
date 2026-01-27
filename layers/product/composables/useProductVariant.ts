import type {
  CustomProductWithStockFromRedis,
  ProductVariantResponse,
  QueryProductVariantArgs,
} from "~/graphql";
import { QueryName } from "~/server/queries";

export const useProductVariant = (slugWithCombinationIds: string) => {
  const { $sdk } = useNuxtApp();

  const loadingProductVariant = ref(false);
  const productVariant = useState<CustomProductWithStockFromRedis>(`product-variant-${slugWithCombinationIds.replace(/[^a-zA-Z0-9]/g, '-')}`, () => ({}) as CustomProductWithStockFromRedis)


  const loadProductVariant = async (params: QueryProductVariantArgs) => {

    if (import.meta.server) {
      return
    }

    loadingProductVariant.value = true

    const dataKey = `product-variant-${params.productTemplateId}-${params.combinationId?.join('-') || 'none'}`

    try {

      const data = await $sdk().odoo.query<QueryProductVariantArgs, ProductVariantResponse>(
        { queryName: QueryName.GetProductVariantQuery },
        params
      )

      if (data?.productVariant) {

        if (data?.productVariant?.product?.displayName) {
          data.productVariant.product.name = data.productVariant.product.displayName.replace(/\[[^\]]*\]/g, '').trim()
        }

        productVariant.value = data.productVariant.product || {} as CustomProductWithStockFromRedis

      }
    } catch (err) {
      productVariant.value = {} as any
    } finally {
      loadingProductVariant.value = false
    }
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
