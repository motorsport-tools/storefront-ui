import type {
  QueryCategoriesArgs,
  QueryCategoryArgs,
  CategoryListResponse,
  Category,
  CategoryResponse,
} from "~/graphql";
import { QueryName } from "~/server/queries";

export const useCategory = (categorySlug?: string) => {
  const { $sdk } = useNuxtApp();

  const loading = ref(false);
  const categories = useState<Category[]>("categories", () => []);
  const category = useState<Category>(
    `category-${categorySlug}`,
    () => ({} as Category)
  );

  const loadCategory = async (params: { slug: string }) => {
    const cleanParam = {
      slug: params.slug?.endsWith('/')
        ? params.slug?.slice(0, -1)
        : params.slug,
    }
    const { data, status } = await useAsyncData(
      () =>
        $sdk().odoo.query<QueryCategoryArgs, CategoryResponse>(
          { queryName: QueryName.GetCategoryQuery },
          cleanParam as QueryCategoryArgs,
          { headers: useRequestHeaders() },
        ),
      { lazy: import.meta.client },
    )

    watch(status, () => {
      if (status.value === 'pending') {
        loading.value = true
      }
      if (status.value === 'success' || status.value === 'error') {
        loading.value = false
      }
    })

    if (import.meta.server) {
      if (data.value?.category?.id === 0) {
        showError({
          status: 404,
        })
      }
      category.value = data.value?.category || ({} as Category)
    }

    watch(data, () => {
      category.value = data.value?.category || ({} as Category)
    })
  }

  const loadCategoryList = async (params: QueryCategoriesArgs) => {
    loading.value = true;
    try {
      const { data } = await useAsyncData(
        `category-list-${categorySlug}`,
        () => $sdk().odoo.query<QueryCategoriesArgs, CategoryListResponse>(
          { queryName: QueryName.GetCategoriesQuery },
          params,
        ),
      )

      if (data.value?.categories) {
        categories.value = data.value.categories?.categories
      }
    } finally {
      loading.value = false
    }
  };

  const buildTree = (categories: any) => {
    if (!categories) {
      return [];
    }
    return categories.map(
      (category: { name: string; slug: string; childs: any; id: string }) => ({
        label: category.name,
        slug: category.slug,
        items: buildTree(category.childs),
        isCurrent: false,
        id: category.id,
      })
    );
  };

  const GetCategoryQueryTree = (searchData: { data: { category: any } }) => {
    if (!searchData) {
      return { items: [], label: "", isCurrent: false }
    }

    const category: any = searchData;
    if (category) {
      return {
        label: category.name,
        slug: category.slug,
        items: buildTree(category.childs),
        isCurrent: false,
        id: category.id,
      };
    }
    return {};
  };

  return {
    loading,
    categories,
    category,
    loadCategoryList,
    loadCategory,
    GetCategoryQueryTree,
  };
};
