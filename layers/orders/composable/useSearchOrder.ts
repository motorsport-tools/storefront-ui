import type { QuerySearchOrderArgs, SearchOrderResponse } from "~/graphql";
import { QueryName } from "~/server/queries";

export const useSearchOrder = () => {
    const { $sdk } = useNuxtApp();
    const i18n = useI18n();
    const loading = ref(false);
    const errorMessage = ref('');

    const search = async (email: string, orderNumber: string) => {
        loading.value = true;
        errorMessage.value = '';

        try {
            const data = await $sdk().odoo.queryNoCache<QuerySearchOrderArgs, SearchOrderResponse>(
                { queryName: QueryName.SearchOrderQuery },
                { email, orderNumber }
            );

            if (data?.searchOrder) {
                return data.searchOrder;
            } else {
                errorMessage.value = i18n.t('orderSearch.error');
                return null;
            }

        } catch (error: any) {
            console.error('Order search error:', error);
            errorMessage.value = i18n.t('orderSearch.error');
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        search,
        loading,
        errorMessage
    };
};
