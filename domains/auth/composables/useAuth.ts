import type { NuxtRoute } from "@typed-router/__router";
import type { RoutesNamesList } from "@typed-router/__routes";
import { useToast } from "vue-toastification";
import type {
  ChangePasswordResponse,
  CreateUpdatePartnerResponse,
  LoadUserQueryResponse,
  LoginUserResponse,
  LoginResponse,
  MutationChangePasswordArgs,
  MutationCreateUpdatePartnerArgs,
  MutationLoginArgs,
  MutationRegisterArgs,
  MutationResetPasswordArgs,
  MutationUpdatePasswordArgs,
  Partner,
  PartnerResponse,
  RegisterUserResponse,
  ResetPasswordResponse,
  UpdatePasswordResponse,
  Cart,
} from "~/graphql";
import { MutationName } from "~/server/mutations";
import { QueryName } from "~/server/queries";

export const useAuth = () => {
  const { $sdk } = useNuxtApp()
  const router = useRouter()
  const { cart } = useCart()
  const userCookie = useCookie<any | null>("odoo-user", { maxAge: 3600 * 30, sameSite: "lax" })
  const user = useState<Partner>("user", () => ({}) as Partner);

  const toast = useToast()

  const loading = ref(false)
  const resetEmail = useCookie<string>("reset-email");

  const loadUser = async (withoutCache: boolean = false) => {
    loading.value = true
    const query = withoutCache ? $sdk().odoo.queryNoCache : $sdk().odoo.query

    const { data } = await query<null, LoadUserQueryResponse>({
      queryName: QueryName.LoadUserQuery,
    });

    userCookie.value = data.value?.partner?.id;
    user.value = data.value?.partner;
    loading.value = false;
  };

  const updatePartner = async (params: MutationCreateUpdatePartnerArgs) => {
    loading.value = true;

    const { data } = await $sdk().odoo.mutation<
      MutationCreateUpdatePartnerArgs,
      CreateUpdatePartnerResponse
    >({ mutationName: MutationName.CreateUpdatePartner }, params);

    user.value = data.value.createUpdatePartner;

    if (userCookie.value?.id) {
      userCookie.value = data.value?.createUpdatePartner?.id;
    }
    //If update partner, update data on cart also
    if (cart.value.order.partner) {
      cart.value.order.partner = data.value?.createUpdatePartner
    }

    toast.success("Partner updated successfully");
  };

  const logout = async () => {
    userCookie.value = null;
    user.value = {} as Partner;
    cart.value = {} as Cart
    await $sdk().odoo.mutation<null, null>({
      mutationName: MutationName.LogoutMutation,
    });
  };

  const signup = async (params: MutationRegisterArgs) => {
    loading.value = true;
    const { data, error } = await $sdk().odoo.mutation<
      MutationRegisterArgs,
      RegisterUserResponse
    >(
      {
        mutationName: MutationName.RegisterUserMutation,
      },
      { ...params }
    );
    loading.value = false;

    if (error.value) {
      toast.error(error.value?.data?.message);
      return;
    }

    user.value = data.value.partner;
    await login({ email: params.email, password: params.password });
    router.push("/my-account/personal-data");
  };

  const login = async (params: MutationLoginArgs, redirectTo: any | false = false) => {
    loading.value = true;
    const { data, error } = await $sdk().odoo.mutation<
      MutationLoginArgs,
      LoginResponse
    >({ mutationName: MutationName.LoginMutation }, { ...params });

    if (error.value) {
      toast.error(error.value?.data?.message);
      return;
    }

    userCookie.value = data.value.login.user?.partner;
    user.value = data.value.login.user?.partner as Partner
    cart.value.order = data.value.cart || {} as Cart
    if (!redirectTo) {
      redirectTo = "/my-account/personal-data"
    }
    router.push(redirectTo);
  };

  const resetPassword = async (params: MutationResetPasswordArgs) => {
    loading.value = true;
    const { error } = await $sdk().odoo.mutation<
      MutationResetPasswordArgs,
      ResetPasswordResponse
    >({ mutationName: MutationName.SendResetPasswordMutation }, { ...params });
    if (error.value) {
      toast.error(error.value?.data?.message);
      return;
    }

    router.push("/reset-password-success");
    resetEmail.value = params.email;
  };

  const successResetEmail = () => {
    const result = resetEmail.value;
    resetEmail.value = "";

    return result;
  };

  const updatePassword = async (params: MutationUpdatePasswordArgs) => {
    loading.value = true;
    const { data, error } = await $sdk().odoo.mutation<
      MutationUpdatePasswordArgs,
      UpdatePasswordResponse
    >({ mutationName: MutationName.UpdatePasswordMutation }, params);
    if (error.value) {
      toast.error(error.value?.data?.message);
      return;
    }

    toast.success("Password updated successfully");
  };

  const changeForgottenPassword = async (
    params: MutationChangePasswordArgs
  ) => {
    loading.value = true;
    const { data, error } = await $sdk().odoo.mutation<
      MutationChangePasswordArgs,
      ChangePasswordResponse
    >({ mutationName: MutationName.ChangePasswordMutation }, params);
    if (error.value) {
      toast.error(error.value?.data?.message);
      return;
    }

    toast.success("Password changed successfully");
    router.push("/");
  };

  const isAuthenticated = computed(() => {
    return Boolean(userCookie.value)
  });

  return {
    signup,
    logout,
    isAuthenticated,
    login,
    resetPassword,
    changeForgottenPassword,
    user,
    loading,
    successResetEmail,
    updatePassword,
    loadUser,
    updatePartner,
  };
};
