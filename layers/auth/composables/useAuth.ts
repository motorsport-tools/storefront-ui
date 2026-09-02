import { useToast } from "vue-toastification";
import type {
  ChangePasswordResponse,
  CreateUpdatePartnerResponse,
  LoadUserQueryResponse,
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
  SignInUserResponse,
  SignUpUserResponse,
  UpdatePasswordResponse,
  Cart,
} from "~/graphql";
import { MutationName } from "~/server/mutations";
import { QueryName } from "~/server/queries";

export const useAuth = () => {
  const { $sdk } = useNuxtApp()
  const router = useRouter()
  const { cart } = useCart()
  const userCookie = useCookie<number | null>("odoo-user", { maxAge: 3600 * 30, sameSite: "lax" })
  const getPublicUser = () =>
    ({
      isPublic: true,
      publicPricelist: {
        id: 4,
      }
    }) as Partner
  const user = useState<Partner>("user", () => ({
    ...getPublicUser(),
  }));

  const toast = useToast()

  const loading = ref(false)
  const authError = useState<string>('auth-error', () => '')
  const resetEmail = useCookie<string>("reset-email");
  const authHydrated = useState<boolean>("auth-hydrated", () => false)

  const setAuthCookie = (partner: Partner | null | undefined) => {
    if (partner?.id && !partner?.isPublic) {
      userCookie.value = Number(partner.id)
      return
    }
    userCookie.value = null
  }

  const loadUser = async (withoutCache: boolean = false) => {
    try {
      loading.value = true

      let data = null
      if (withoutCache) {
        data = await $sdk().odoo.queryNoCache<null, LoadUserQueryResponse>({
          queryName: QueryName.LoadUserQuery,
        });
      } else {
        data = await $sdk().odoo.query<null, LoadUserQueryResponse>({
          queryName: QueryName.LoadUserQuery,
        });
      }

      user.value = data?.partner as Partner
      if (data?.partner?.id) {
        setAuthCookie(data.partner as Partner)
      } else if (import.meta.client) {
        setAuthCookie(null)
      }
      authHydrated.value = true
      return user.value
    } catch (e: any) {
      // Treat "no user in session" as a normal public state.
      user.value = getPublicUser()
      if (import.meta.client) {
        setAuthCookie(null)
      }
      authHydrated.value = true
      return null
    } finally {
      loading.value = false
    }
  };

  const isRouteCachedFromServer = () => {
    if (import.meta.server) {
      const route = useRoute()
      return route.path === '/' || route.path.startsWith('/product/')
    }
    return false
  }

  const hydrateAuthOnce = async () => {
    if (isRouteCachedFromServer()) {
      user.value = getPublicUser()
      authHydrated.value = false
      return null
    }

    if (authHydrated.value) {
      return user.value
    }

    // No auth cookie means we can safely initialize as public without backend call.
    if (!userCookie.value) {
      user.value = getPublicUser()
      authHydrated.value = true
      return null
    }

    return loadUser(true)
  }

  const updatePartner = async (params: MutationCreateUpdatePartnerArgs) => {
    loading.value = true;
    try {
      const data = await $sdk().odoo.mutation<
        MutationCreateUpdatePartnerArgs,
        CreateUpdatePartnerResponse
      >({ mutationName: MutationName.CreateUpdatePartner }, params);

      user.value = data?.createUpdatePartner;

      if (userCookie.value) {
        setAuthCookie(data?.createUpdatePartner as Partner)
      }
      //If update partner, update data on cart also
      if (cart.value?.order?.partner) {
        cart.value.order.partner = data?.createUpdatePartner
      }
    } finally {
      loading.value = false;
    }

    //toast.success("Partner updated successfully");
  };

  const logout = async () => {
    userCookie.value = null;
    user.value = getPublicUser();
    authHydrated.value = true
    cart.value = {} as Cart
    await $sdk().odoo.mutation<null, null>({
      mutationName: MutationName.LogoutMutation,
    });
  };

  const signup = async (params: MutationRegisterArgs) => {
    try {
      loading.value = true
      authError.value = ''
      const data = await $sdk().odoo.mutation<MutationRegisterArgs, SignUpUserResponse>(
        {
          mutationName: MutationName.RegisterUserMutation,
        },
        { ...params },
      )
      user.value = data.register.partner
      await login({ email: params.email, password: params.password })
      router.push('/my-account')

    } catch (error: any) {
      authError.value = error?.data?.message || 'We couldn\'t create your account. Please try again.'
      return
    } finally {
      loading.value = false
    }
  }

  const login = async (params: MutationLoginArgs, redirectTo: any | false = false) => {
    try {
      loading.value = true;
      authError.value = ''

      const data = await $sdk().odoo.mutation<
        MutationLoginArgs,
        SignInUserResponse
      >({ mutationName: MutationName.LoginMutation }, { ...params })

      user.value = data?.login?.user?.partner as Partner
      setAuthCookie(data?.login?.user?.partner as Partner)
      authHydrated.value = true
      if (cart.value) {
        cart.value.order = data?.login?.cart || {} as Cart
      }
      if (!redirectTo) {
        redirectTo = "/my-account"
      }
      router.push(redirectTo)
    } catch (error: any) {
      console.error('Login error:', error)
      const extractedMessage = error?.data?.message || error?.data?.[0]?.message || error?.message
      authError.value = extractedMessage || 'The email or password you entered is incorrect.'
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (params: MutationResetPasswordArgs) => {
    loading.value = true
    try {
      const data = await $sdk().odoo.mutation<
        MutationResetPasswordArgs,
        ResetPasswordResponse
      >({ mutationName: MutationName.SendResetPasswordMutation }, { ...params })

      router.push("/reset-password-success")
      resetEmail.value = params.email
    } catch (error: any) {
      toast.error(error.data?.message)
    } finally {
      loading.value = false
    }
  }

  const successResetEmail = () => {
    const result = resetEmail.value;
    resetEmail.value = "";

    return result;
  };

  const updatePassword = async (params: MutationUpdatePasswordArgs) => {
    loading.value = true
    try {
      const data = await $sdk().odoo.mutation<
        MutationUpdatePasswordArgs,
        UpdatePasswordResponse
      >({ mutationName: MutationName.UpdatePasswordMutation }, params)
      toast.success('Password updated successfully')
    } catch (error: any) {
      toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const changeForgottenPassword = async (
    params: MutationChangePasswordArgs
  ) => {
    try {
      loading.value = true
      const data = await $sdk().odoo.mutation<
        MutationChangePasswordArgs,
        ChangePasswordResponse
      >({ mutationName: MutationName.ChangePasswordMutation }, params)
      toast.success('Password changed successfully')
      router.push('/')
    } catch (error: any) {
      toast.error(error?.data?.message)
    } finally {
      loading.value = false
    }
  }

  const isAuthenticated = computed(() => {
    if (isRouteCachedFromServer()) {
      return false
    }
    return Boolean(userCookie.value) && Boolean(user.value?.id) && !user.value?.isPublic
  });

  const Pid = computed(() => {
    return user.value?.publicPricelist?.id || 4
  })

  return {
    signup,
    logout,
    isAuthenticated,
    login,
    resetPassword,
    changeForgottenPassword,
    user,
    loading,
    authError,
    Pid,
    successResetEmail,
    updatePassword,
    loadUser,
    hydrateAuthOnce,
    updatePartner,
  };
};
