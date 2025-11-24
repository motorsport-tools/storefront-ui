import { useProductAttributes } from './useProductAttributes'
import type {
  AttributeValue,
  CustomProductWithStockFromRedis,
  ProductResponse,
  QueryProductArgs,
} from '~/graphql'
import { QueryName } from '~/server/queries'

const { getRegularPrice, getSpecialPrice } = useProductAttributes()
export const useProductTemplate = (slug: string) => {
  const cleanSlug = slug?.endsWith('/') ? slug?.slice(0, -1) : slug
  const { $sdk } = useNuxtApp()

  const loadingProductTemplate = useState(
    `loading-product-template`,
    () => false,
  )
  const productTemplate = useState<CustomProductWithStockFromRedis>(`product-template`,
    () => ({} as CustomProductWithStockFromRedis),
  )

  const loadProductTemplate = async (params: QueryProductArgs) => {
    if (productTemplate.value?.id && productTemplate.value?.slug?.replace(/\/$/, '').toLowerCase().trim() === params.slug) {
      return
    }

    loadingProductTemplate.value = true

    try {

      const dataKey = `product-template-${cleanSlug}`

      const { data, status, error } = await useAsyncData(dataKey, () =>
        $sdk().odoo.query<QueryProductArgs, ProductResponse>(
          { queryName: QueryName.GetProductTemplateQuery },
          params,
          { headers: useRequestHeaders() },
        ),
        {
          server: true, lazy: false, deep: true,
          getCachedData: (key) => {
            const nuxtApp = useNuxtApp()
            return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
          }
        }
      )

      if (error.value) {
        loadingProductTemplate.value = false
        throw showError({
          statusCode: 404,
          message: 'Product not found'
        })
      }

      if (data.value?.product) {
        productTemplate.value = data.value.product as CustomProductWithStockFromRedis || {}
        loadingProductTemplate.value = false

        if (!productTemplate.value?.id) {
          showError({
            status: 404,
            message: 'Product not found',
          })
        }
      }
    } catch (err) {
      productTemplate.value = null
    } finally {
      loadingProductTemplate.value = false
    }
  }

  const specialPrice = computed(() => {
    if (!productTemplate.value?.firstVariant) {
      return
    }
    return getSpecialPrice(productTemplate.value?.firstVariant)
  })

  const regularPrice = computed(() => {
    if (!productTemplate.value?.firstVariant) {
      return
    }
    return getRegularPrice(productTemplate.value?.firstVariant)
  })

  const getAllAmounts = computed(() => {
    return productTemplate.value?.attributeValues
      ?.filter((item: AttributeValue) => item?.attribute?.name === 'Amount')
      ?.map((item: AttributeValue) => ({
        value: item.id,
        label: `£${item.name} Gift Card ${item.priceExtra ? '+ £' + item.priceExtra + ' extra' : ''}`,
      }))
  })


  const getAllSizes = computed(() => {
    return productTemplate?.value?.attributeValues
      ?.filter((item: AttributeValue) => item?.attribute?.name === 'Size')
      ?.map((item: AttributeValue) => ({
        value: item.id,
        label: item.name,
      }))
  })

  const getAllColors = computed(() => {
    return productTemplate?.value?.attributeValues
      ?.filter((item: AttributeValue) => item?.attribute?.name === 'Color')
      ?.map((item: AttributeValue) => ({
        value: item.id,
        label: item.name,
      }))
  })

  const getAllMaterials = computed(() => {
    return productTemplate?.value?.attributeValues
      ?.filter((item: AttributeValue) => item?.attribute?.name === 'Material')
      ?.map((item: AttributeValue) => ({
        value: item.id,
        label: item.name,
      }))
  })

  return {
    loadProductTemplate,
    loadingProductTemplate,
    productTemplate,
    regularPrice,
    specialPrice,
    getAllAmounts,
    getAllSizes,
    getAllColors,
    getAllMaterials,
  }
}