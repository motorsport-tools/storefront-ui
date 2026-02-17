import { useMegaMenuCategories } from "./useMegaMenuCategories"
import { useCountryList } from "./useCountryList"

export const useSiteSetup = () => {
    const { loadCategoriesForMegaMenu, categoriesForMegaMenu } = useMegaMenuCategories()
    const { isAuthenticated, loadUser } = useAuth()
    const { loadWishlist } = useWishlist()
    const { loadCart } = useCart()
    const { loadCountries } = useCountryList()

    const setup = async () => {
        // 1. Load Mega Menu (Global data, now cached session-agnostically)
        const megaMenuPromise = loadCategoriesForMegaMenu({ filter: { parent: true } as any, pageSize: 4 })

        if (import.meta.server) {
            await Promise.all([
                megaMenuPromise,
                loadCountries()
            ])
            return
        }

        // 2. Client-side: Trigger fetches but don't block hydration
        const initClient = async () => {
            if (isAuthenticated.value) {
                await Promise.all([
                    loadUser(true),
                    loadWishlist(),
                    loadCart(),

                ])
            } else {
                await Promise.all([
                    loadCart(),

                ])
            }
        }

        initClient()
    }

    return {
        setup,
        categoriesForMegaMenu
    }
}
