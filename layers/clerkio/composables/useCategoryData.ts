// composables/categoryState.ts
export const useCategoryData = () => {
    const category = useState(`category-data`)

    const setCategory = (value) => {
        category.value = value
    }
    return {
        category,
        setCategory
    }
}