const queryParamsNotFilters = ["page", "itemsPerPage", "sort", "search"];

const facetTypes: Record<string, string> = {
    "price": 'price',
    "on_sale": 'boolean',
    "has_stock": 'in-stock',
    "_price_range": 'price',
}

export const formatLabel = (str: string) => {
    if (str === 'has_stock') return 'Availability'
    if (str === '_all_category_names' || str === '_category_name') return 'Categories'
    return str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
}

export const generateFacet = (key: string) => {
    return {
        id: key,
        attributeName: key,
        label: formatLabel(key),
        options: [],
        search: '',
        open: true,
        type: facetTypes[key] || 'select'
    }
}

export const generatePriceBuckets = (values: any[], min: number | null, max: number | null, bucketCount = 5) => {
    if (!values.length) return []

    const numbers = values
        .map(item => ({ c: item.c, v: parseFloat(item.v) }))
        .filter(n => !isNaN(n.v))

    if (!numbers.length) return []

    min = min != null ? Number(min) : Math.min(...numbers.map(n => n.v))
    max = max != null ? Number(max) : Math.max(...numbers.map(n => n.v))

    const step = (max - min) / bucketCount
    const buckets: any[] = []

    for (let i = 0; i < bucketCount; i++) {
        const lower = min + step * i
        const upper = i === bucketCount - 1 ? max : min + step * (i + 1)

        buckets[i] = {
            id: `pr${i}`,
            values: `${lower.toFixed(2)}-${upper.toFixed(2)} `,
            total: 0,
            label: `£${lower.toFixed(2)} - £${upper.toFixed(2)} `,
            _max: upper
        }
    }

    numbers.forEach(num => {
        for (const bucket of buckets) {
            if (num.v <= bucket._max) {
                bucket.total += num.c
                break
            }
        }
    })

    return buckets
}

export const generateQueryFromUrl = (query: any) => {
    const newQuery: any = { ...query }
    let filters: string = ''

    if (newQuery) {
        Object.keys(newQuery).forEach((filterKey) => {
            if (![...queryParamsNotFilters, "Price"].includes(filterKey)) {
                console.log('Filter Key:', filterKey)
                if (query[filterKey].includes(",")) {
                    filters += `${filterKey.toLowerCase()} in `
                    query[filterKey]?.split(",").forEach((item) => {
                        filters += `${item},`
                    });
                    filters = filters.slice(0, -1)
                } else {
                    const label = query[filterKey]?.split(",")[0];
                    console.log('Label:', label)
                    filters += `${filterKey.toLowerCase()} = ${label}`
                }
            }
        })
    }
    const price = query?.price?.split("-")
    const availability = query?.Availability ? true : false
    const pageSize = query.itemsPerPage ? parseInt(query.itemsPerPage) : 20
    const sort = query?.sort ? String(query?.sort) : 'popular:desc'
    const page = query?.page ? parseInt(query.page) : 1

    return {
        query: String(query?.search) || '',
        limit: pageSize || 20,
        offset: page > 1 ? (page - 1) * pageSize : 0,
        filter: filters,
        sort: sort
    }
}