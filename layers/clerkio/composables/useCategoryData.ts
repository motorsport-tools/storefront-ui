// composables/categoryState.ts
import { type Category } from "~/graphql"

export const useCategoryData = () => {
    const category = useState<Category | null>('category-data', () => null)

    const setCategory = (value: Category | null) => {
        category.value = value
    }
    return {
        category,
        setCategory
    }
}