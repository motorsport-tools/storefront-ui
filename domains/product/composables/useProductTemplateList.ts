import type {
  AttributeValue,
  Category,
  Product,
  ProductTemplateListResponse,
  QueryProductsArgs,
} from "~/graphql";
import { QueryName } from "~/server/queries";

export const useProductTemplateList = (
  categorySlugIndex?: string,
  fullSearchIndex?: string
) => {
  const { $sdk } = useNuxtApp();

  const loading = useState(
    `loading-product-template-list-${fullSearchIndex}`,
    () => false
  );
  const totalItems = useState<number>(`total-items${fullSearchIndex}`, () => 0);
  const filterCounts = useState<{ type: string, id: number, total: number }[]>(`filter-counts${fullSearchIndex}`, () => ([]))
  const productTemplateList = useState<Product[]>(
    `products-category${fullSearchIndex}`,
    () => []
  );
  const attributes = useState<AttributeValue[]>(
    `attributes${categorySlugIndex}`,
    () => []
  );
  const categories = useState<Category[]>(
    `categories-from-product-${categorySlugIndex}`,
    () => []
  );
  const stockCount = useState<Number>(
    `stockCount${categorySlugIndex}${fullSearchIndex}`,
    () => 0
  );

  const loadProductTemplateList = async (
    params: QueryProductsArgs,
    force: boolean = false
  ) => {

    if (productTemplateList.value.length > 0 && !force) return;

    loading.value = true;
    const { data } = await $sdk().odoo.query<
      QueryProductsArgs,
      ProductTemplateListResponse
    >({ queryName: QueryName.GetProductTemplateListQuery }, params);
    loading.value = false;

    productTemplateList.value = data.value?.products?.products || [];

    const categ = useUniqBy(
      productTemplateList.value?.flatMap((p) => p.categories || []).filter((c) => c),
      "id"
    )
    attributes.value = data.value?.products?.attributeValues || [];
    totalItems.value = data.value?.products?.totalCount || 0;
    filterCounts.value = data.value?.products?.filterCounts || []
    categories.value = [...categ]
  };

  const organizedAttributes = computed(() => {
    if (!productTemplateList.value) return [];

    const data: any = [];

    attributes.value?.forEach((item: any) => {
      const current = data.find(
        (itemData: { attributeName: any }) =>
          itemData.attributeName === item.attribute?.name
      );

      if (!current) {
        data.push({
          id: String(item.attribute.id),
          label: item.attribute?.name,
          attributeName: item.attribute?.name,
          type: item.displayType,
          count: 0,
          options: [],
        });
      }

      data
        .find(
          (itemData: { attributeName: any }) =>
            itemData.attributeName === item.attribute?.name
        )
        .options.push({
          id: String(item.search),
          value: item.id,
          label: item.name,
          metadata: item.search,
          htmlColor: item.htmlColor,
          total: filterCounts.value?.find((filter) => filter.id === item.id)?.total || 0
        });
    });

    const inStockFilterCount = filterCounts.value?.find(
      (filter) => filter.type === "in_stock"
    );
    if (inStockFilterCount) {
      stockCount.value = inStockFilterCount.total;
    }


    return data;
  });

  return {
    loading,
    loadProductTemplateList,
    productTemplateList,
    organizedAttributes,
    totalItems,
    categories,
    stockCount
  };
};