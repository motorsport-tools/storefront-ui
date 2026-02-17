import type {
    RmaOperation,
    MutationCreateRmaArgs,
} from "~/graphql";
import { QueryName } from "~/server/queries";
import { MutationName } from "~/server/mutations";

export const useRma = () => {
    const { $sdk } = useNuxtApp();
    const loading = ref(false);
    const rmaOperations = ref<RmaOperation[]>([]);

    const getRmaOperations = async () => {
        loading.value = true;
        try {
            const data = await $sdk().odoo.queryNoCache<any, { rmaOperations: RmaOperation[] }>(
                { queryName: QueryName.GetRmaOperationsQuery },
                {}
            );
            rmaOperations.value = data?.rmaOperations || [];
        } catch (error) {
            console.error("Error fetching RMA operations:", error);
        } finally {
            loading.value = false;
        }
    };

    const createRma = async (params: MutationCreateRmaArgs) => {
        loading.value = true;
        try {
            const data = await $sdk().odoo.mutation<MutationCreateRmaArgs, any>(
                { mutationName: MutationName.CreateRma },
                params
            );
            return data?.createRma;
        } catch (error) {
            console.error("Error creating RMA:", error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        rmaOperations,
        getRmaOperations,
        createRma,
    };
};
