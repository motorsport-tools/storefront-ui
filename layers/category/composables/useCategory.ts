import type {
  Category,
  CategoryResponse,
  QueryCategoryArgs,
} from "~/graphql";
import { QueryName } from "~/server/queries/index";

export const useCategory = () => {
  const { $sdk } = useNuxtApp();

  const loadCategory = async (params: { slug: string }) => {
    const cleanParam = {
      slug: params.slug?.endsWith('/')
        ? params.slug?.slice(0, -1)
        : params.slug,
    }

    const data = await $sdk().odoo.query<QueryCategoryArgs, CategoryResponse>(
      { queryName: QueryName.GetCategoryQuery },
      cleanParam as QueryCategoryArgs,
      { headers: useRequestHeaders() }
    )

    if (data?.category?.id === 0) {
      createError({
        status: 404,
      })
    }
    return data?.category || ({} as Category)
  }

  return {
    loadCategory,
  };
};
