import type {
  QueryCategoriesArgs,
  CategoryListResponse,
  Category,
} from "~/graphql";
import { QueryName } from "~/server/queries";

export const useMegaMenuCategories = () => {
  const { $sdk } = useNuxtApp();

  const loading = ref(false);
  const categoriesForMegaMenu = useState<Category[]>("mega-menu-categories", () => []);


  const loadCategoriesForMegaMenu = async (params: QueryCategoriesArgs) => {
    loading.value = true;
    try {
      const { data } = await useAsyncData('categories-megamenu', async () => {
        const { categories } = await $sdk().odoo.query<
          QueryCategoriesArgs,
          CategoryListResponse
        >({ queryName: QueryName.GetCategoriesQuery }, params);
        const menu = transformMenuData(categories?.categories || [])
        return menu
      }
      );

      if (data?.value) {
        categoriesForMegaMenu.value = data.value
      }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    categoriesForMegaMenu,
    loadCategoriesForMegaMenu
  };
};