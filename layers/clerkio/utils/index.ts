const queryParamsNotFilters = ["page", "itemsPerPage", "sort", "search"];

const facetTypes: Record<string, string> = {
    "price": 'price',
    "on_sale": 'boolean',
    "has_stock": 'in-stock',
    "_price_range": 'price',
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

export const facetShowToggle = async (el: HTMLDivElement | null, expandedFacets: Record<string, boolean>, index: string | number) => {
    expandedFacets[index] = !expandedFacets[index]

    if (!el) {
        return
    }

    const start = el.offsetHeight

    await nextTick()

    const end = el.scrollHeight


    el.style.height = start + 'px'
    // force reflow
    void el.offsetHeight
    el.style.transition = 'height 260ms ease'
    el.style.height = end + 'px'

    el.addEventListener('transitionend', () => {
        el.style.height = ''
        el.style.transition = ''
    }, { once: true })
}