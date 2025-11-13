export const useSearchClient = (config = {}) => {
    const runtimeConfig = useRuntimeConfig()
    const defaultConfig = {
        url: 'https://api.clerk.io/v3/search/products',
        apiKey: runtimeConfig.public.clerkApiKey,
        primaryKey: 'id',
        retrievableAttributes: [
            'id', 'name', 'brand', 'image', 'price', 'on_sale',
            'list_price', 'rating', 'ratingCount', 'sku', 'slug', 'has_stock',
            'image_slug', 'image_filename',
            'pricelist_ids', 'pricelist_names', 'pricelist_prices', 'pricelist_list_prices', 'pricelist_price_extra', 'pricelist_on_sale', 'pricelist_currencies', 'pricelist_discount_perc',
        ],
        searchableAttributes: ['name', 'brand', 'sku'],
        defaultFacets: ['price', 'fits', 'brand', 'on_sale', 'has_stock'],
        cacheTTL: 120000,
    }

    const mergedConfig = { ...defaultConfig, ...config }

    /**
     * InstantSearch.js Adapter for Meilisearch-like REST API
     * 
     * API returns:
     * {
     *   result: [...],
     *   estimated_total_count: 72,
     *   total_count: 72,
     *   facets: {...}
     * }
     */
    let cachedTotal = null;
    let lastQuery = null;
    class SearchAdapter {
        constructor(config) {
            this.apiUrl = config.url;
            this.apiKey = config.apiKey;
            this.isCategoryPage = config.isCategoryPage || false
            this.searchableAttributes = config.searchableAttributes || [];
            this.retrievableAttributes = config.retrievableAttributes || []; // Your 'attributes' parameter
            this.primaryKey = config.primaryKey || 'id';
            this.defaultFacets = config.defaultFacets || []; // Default facets to always include
            this.maxCategoryDepth = config.maxCategoryDepth || 6;
            this.cache = new Map();
            this.cacheTTL = config.cacheTTL || 60000; // 1 minute default
        }

        getCategoryLevelAttributes() {
            const attrs = [];
            for (let i = 0; i < this.maxCategoryDepth; i++) {
                attrs.push(`_category_lvl${i}`);
            }
            return attrs;
        }

        /**
         * Transform InstantSearch request to your API format
         */
        transformRequest(request) {
            const { params } = request;
            console.log('Request Params:', params)
            const apiRequest = {
                query: params.query || '',
                limit: params.hitsPerPage || 20,
                offset: (params.page || 0) * (params.hitsPerPage || 20),
                semantic: 0, // Set to 1 if you want semantic search
            };

            // Add attributes to retrieve
            if (this.retrievableAttributes && this.retrievableAttributes.length > 0) {
                apiRequest.attributes = this.retrievableAttributes;
            }

            let facets = [...this.defaultFacets];

            if (params.facets && params.facets.length > 0) {
                if (typeof params.facets === 'string') {
                    params.facets = [params.facets]
                }
                // If InstantSearch requests _category_lvl*, map them to API's category facets
                const categoryLevelRequests = params.facets.filter(f => f.startsWith('_category_lvl'));

                if (categoryLevelRequests.length > 0) {
                    // Add all category levels to the facet request
                    const categoryLevels = this.getCategoryLevelAttributes();
                    facets.push(...categoryLevels);
                }

                // Add other non-category facets
                const otherFacets = params.facets.filter(f => !f.startsWith('_category_lvl'));
                facets.push(...otherFacets);
            }

            // Remove duplicates
            facets = [...new Set(facets)];

            if (facets.length > 0) {
                apiRequest.facets = facets;
            }

            // Transform filters to your format: ["brand in ['list1','list2']"]
            const filters = this.buildFilters(params);
            if (filters && filters.length > 0) {
                apiRequest.filter = filters;
            }

            // Add sort - handle InstantSearch sortBy format
            const sort = this.extractSort(request.indexName, params);
            if (sort) {
                apiRequest.sort = [sort]
            }
            return apiRequest;
        }

        /**
         * Build filter array in your format: ["brand in ['Apple','Dell']", "price > 100"]
         * Converts from InstantSearch's facetFilters and numericFilters
         */
        buildFilters(params) {
            const filters = [];

            // IMPORTANT: Handle the 'filters' param from ais-configure FIRST
            // This is where category filters come from!
            if (params.filters) {
                // params.filters is a string like "category_id = '123'"
                filters.push(params.filters);
            }

            if (params.facetFilters && params.facetFilters.length > 0) {
                params.facetFilters.forEach(filterGroup => {
                    if (Array.isArray(filterGroup)) {
                        const grouped = {};

                        filterGroup.forEach(filter => {
                            const [field, ...valueParts] = filter.split(':');
                            const value = valueParts.join(':');

                            if (!grouped[field]) {
                                grouped[field] = [];
                            }
                            grouped[field].push(value);
                        });

                        Object.keys(grouped).forEach(field => {
                            if (grouped[field].length === 1) {
                                filters.push(`${field} = '${grouped[field][0]}'`);
                            } else {
                                const valueList = grouped[field].map(v => `'${v}'`).join(',');
                                filters.push(`${field} in [${valueList}]`);
                            }
                        });
                    } else {
                        const [field, ...valueParts] = filterGroup.split(':');
                        const value = valueParts.join(':');
                        filters.push(`${field} = '${value}'`);
                    }
                });
            }

            if (params.hierarchicalFacetsRefinements) {
                Object.keys(params.hierarchicalFacetsRefinements).forEach(facetName => {
                    const values = params.hierarchicalFacetsRefinements[facetName];
                    if (values && values.length > 0) {
                        values.forEach(value => {
                            filters.push(`${facetName} = '${value}'`);
                        });
                    }
                });
            }

            if (params.numericFilters && params.numericFilters.length > 0) {
                params.numericFilters.forEach(filter => {
                    const match = filter.match(/(\w+)\s*(>=|<=|>|<|=)\s*(\d+\.?\d*)/);
                    if (match) {
                        const [, field, operator, value] = match;
                        filters.push(`${field} ${operator} ${value}`);
                    }
                });
            }

            return filters;
        }

        /**
         * Extract sort from indexName or params
         * InstantSearch uses format: "products/sort/price:desc"
         */
        extractSort(indexName, params) {
            // Check if indexName contains sort info
            const parts = indexName.split('/');
            if (parts.length >= 3 && parts[1] === 'sort') {
                // Format: "products/sort/price:desc"
                return parts[2]; // Returns "price:desc"
            }

            // Otherwise check params
            if (params.sortBy) {
                return params.sortBy;
            }

            return null;
        }

        /**
         * Transform your API response to InstantSearch format
         */
        transformResponse(apiResponse, request) {
            const { params } = request;
            const hitsPerPage = params.hitsPerPage || 20;
            const page = params.page || 0;

            const currentQuery = JSON.stringify({
                indexName: params.indexName,
                query: params.query,
                facets: params.facets,
                facetFilters: JSON.stringify(params.facetFilters || []),
                numericFilters: JSON.stringify(params.numericFilters || []),
            });

            if (currentQuery !== lastQuery) {
                cachedTotal = null;
                lastQuery = currentQuery;
            }

            const apiTotal = apiResponse.total_count ?? apiResponse.estimated_total_count ?? 0;

            const expectedLastPage = cachedTotal ? Math.ceil(cachedTotal / hitsPerPage) - 1 : null;
            const isLikelyLastPage = expectedLastPage && page >= expectedLastPage;

            if (!cachedTotal || !isLikelyLastPage) {
                cachedTotal = apiTotal;
            }

            const totalHits = cachedTotal;

            const res = {
                hits: (apiResponse.result || []).map(item => this.transformHit(item, params)),
                nbHits: totalHits,
                page: page,
                nbPages: Math.ceil(totalHits / hitsPerPage),
                hitsPerPage: hitsPerPage,
                processingTimeMS: apiResponse.processingTimeMS || 0,
                query: params.query || '',
                params: this.stringifyParams(params),

                // Transform facets from your format to Algolia format
                facets: this.transformFacets(apiResponse.facets),

                // Pass through facets_stats - InstantSearch uses this for range widgets
                facets_stats: apiResponse.facets_stats || {},

                // Optional fields
                exhaustiveNbHits: apiResponse.total_count !== undefined,
                exhaustiveFacetsCount: true,
                index: request.indexName,
                indexUsed: request.indexName,
            }

            return res
        }

        /**
         * Transform individual hit
         */
        transformHit(item, params) {
            const hit = {
                objectID: String(item[this.primaryKey] || item.id || Math.random()),
                ...item,
            };

            // Create highlight results
            hit._highlightResult = this.createHighlights(item, params);

            // If API provides _formatted, use it for highlighting
            if (item._formatted) {
                Object.keys(item._formatted).forEach(field => {
                    if (!hit._highlightResult[field]) {
                        hit._highlightResult[field] = {
                            value: item._formatted[field],
                            matchLevel: 'full',
                            matchedWords: [params.query || ''],
                        }
                    }
                });
            }

            return hit;
        }

        /**
         * Create highlight results for searchable attributes
         */
        createHighlights(item, params) {
            const highlights = {};
            const query = params.query || '';
            const highlightPreTag = params.highlightPreTag || '<mark>';
            const highlightPostTag = params.highlightPostTag || '</mark>';

            // Use configured searchable attributes or all string fields
            const fieldsToHighlight = this.searchableAttributes.length > 0
                ? this.searchableAttributes
                : Object.keys(item).filter(key => typeof item[key] === 'string');

            fieldsToHighlight.forEach(field => {
                const value = item[field];

                if (value === null || value === undefined) {
                    highlights[field] = {
                        value: '',
                        matchLevel: 'none',
                        matchedWords: [],
                    };
                    return;
                }

                const stringValue = String(value);
                let highlightedValue = stringValue;
                const matchedWords = [];

                if (query && stringValue) {
                    // Simple highlighting - you may want to make this more sophisticated
                    const queryWords = query.split(/\s+/).filter(Boolean);

                    queryWords.forEach(word => {
                        const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
                        const matches = stringValue.match(regex);

                        if (matches) {
                            matchedWords.push(...matches);
                            highlightedValue = highlightedValue.replace(
                                regex,
                                `${highlightPreTag}$1${highlightPostTag}`
                            );
                        }
                    });
                }

                highlights[field] = {
                    value: highlightedValue,
                    matchLevel: matchedWords.length > 0 ? 'full' : 'none',
                    matchedWords: [...new Set(matchedWords)],
                };
            });

            return highlights;
        }

        /**
         * Transform facets to Algolia format
         * API format: { brand: [{ c: 34, v: "MyBrand" }] }
         * Algolia format: { brand: { "MyBrand": 34 } }
         */
        transformFacets(apiFacets) {
            if (!apiFacets) return {};

            const facets = {};

            Object.keys(apiFacets).forEach(facetName => {
                const facetData = apiFacets[facetName];
                facets[facetName] = {};

                if (Array.isArray(facetData)) {
                    // Your format: [{ c: 34, v: "MyBrand" }]
                    facetData.forEach(item => {
                        facets[facetName][item.v] = item.c;
                    });
                } else if (typeof facetData === 'object') {
                    // Already in correct format: { "Apple": 45 }
                    facets[facetName] = facetData;
                }
            });

            return facets;
        }

        /**
        * Escape regex special characters
        */
        escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        /**
        * Stringify params for the response
        */
        stringifyParams(params) {
            return Object.entries(params)
                .map(([key, value]) => {
                    const stringValue = typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value);
                    return `${key}=${encodeURIComponent(stringValue)}`;
                })
                .join('&');
        }

        /**
         * REQUIRED: Main search method
         */
        async search(requests) {
            try {
                const responses = await Promise.all(
                    requests.map(request => this.searchSingle(request))
                );

                return { results: responses };
            } catch (error) {
                console.error('Search error:', error);

                // Return empty results on error
                return {
                    results: requests.map(request => ({
                        hits: [],
                        nbHits: 0,
                        page: 0,
                        nbPages: 0,
                        hitsPerPage: request.params.hitsPerPage || 20,
                        processingTimeMS: 0,
                        query: request.params.query || '',
                        params: '',
                        exhaustiveNbHits: true,
                        index: request.indexName,
                    })),
                };
            }
        }

        /**
         * Search for a single request
         */
        async searchSingle(request) {
            const start = Date.now()

            const normalizedRequest = {
                indexName: request.indexName,
                query: request.params.query || '',
                page: request.params.page || 0,
                facets: Array.isArray(request.params.facets)
                    ? request.params.facets.sort().join(',')
                    : (request.params.facets || ''),
                facetFilters: JSON.stringify(request.params.facetFilters || []),
                numericFilters: JSON.stringify(request.params.numericFilters || []),
                hitsPerPage: request.params.hitsPerPage || 20,
            }

            const cacheKey = JSON.stringify(normalizedRequest)

            // Check cache
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }

            // Transform request
            const apiRequest = this.transformRequest(request);

            // Determine the index/endpoint to use
            const indexPath = this.getIndexPath(request.indexName);
            const url = `${this.apiUrl}${indexPath}`;

            // Make API call
            const options = {
                key: this.apiKey,
                visitor: 'auto',
                labels: this.isCategoryPage ? ['Category page'] : ['Search page'],
                semantic: 0,
            }
            const response = await $fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...options, ...apiRequest, }),
            });
            const processingTimeMS = Date.now() - start
            // Transform response
            const result = this.transformResponse({ ...response, processingTimeMS }, request);

            // Cache result
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now(),
            });

            return result;
        }

        /**
         * Get the API path for a given index name
         * Handles sort indices like "products/sort/price:asc"
         */
        getIndexPath(indexName) {
            // Handle sort syntax: "products/sort/price:asc"
            const parts = indexName.split('/');
            const baseIndex = parts[0];

            // You might need to adjust this based on your API structure
            return `/indexes/${baseIndex}/search`;
        }

        /**
         * Search for facet values (for searchable refinement lists)
         */
        async searchForFacetValues(requests) {

            try {
                const responses = await Promise.all(
                    requests.map(async (request) => {
                        try {
                            const { indexName, params } = request;
                            const { facetName, facetQuery = '', maxFacetHits = 10 } = params;

                            // Build a search request that includes the facet
                            const searchRequest = {
                                indexName,
                                params: {
                                    query: '', // Empty query to get all facets
                                    hitsPerPage: 0,
                                    facets: [facetName],
                                    facetFilters: params.facetFilters || [],
                                    numericFilters: params.numericFilters || [],
                                    filters: params.filters || '',
                                }
                            };

                            // Search to get facet values
                            const result = await this.searchSingle(searchRequest);

                            // Extract facet values
                            const facetValues = result.facets?.[facetName] || {};

                            // Filter and format facet values based on the query
                            const facetHits = Object.entries(facetValues)
                                .map(([value, count]) => ({
                                    value,
                                    count,
                                    highlighted: this.highlightFacetValue(value, facetQuery),
                                    isRefined: false, // CRITICAL: InstantSearch needs this field
                                }))
                                .filter(hit => {
                                    // Filter based on facetQuery
                                    if (!facetQuery) return true;
                                    return hit.value.toLowerCase().includes(facetQuery.toLowerCase());
                                })
                                .sort((a, b) => {
                                    // Sort by count descending, then alphabetically
                                    if (b.count !== a.count) {
                                        return b.count - a.count;
                                    }
                                    return a.value.localeCompare(b.value);
                                })
                                .slice(0, maxFacetHits);

                            return {
                                facetHits: Array.isArray(facetHits) ? facetHits : [],
                                exhaustiveFacetsCount: true,
                                processingTimeMS: 1,
                            };
                        } catch (innerError) {
                            console.error('Single facet search error:', innerError);
                            return {
                                facetHits: [],
                                exhaustiveFacetsCount: true,
                                processingTimeMS: 0,
                            };
                        }
                    })
                );

                // CRITICAL: Don't wrap in results - return the array directly
                // The helper expects the raw response array
                return responses;
            } catch (error) {
                console.error('searchForFacetValues error:', error);
                return {
                    results: requests.map(() => ({
                        facetHits: [],
                        exhaustiveFacetsCount: true,
                        processingTimeMS: 0,
                    })),
                };
            }
        }

        /**
         * Highlight matching text in facet values
         */
        highlightFacetValue(value, query) {
            if (!query) return value;

            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            return value.replace(regex, '<mark>$1</mark>');
        }

        /**
         * Optional: Clear cache
         */
        clearCache() {
            this.cache.clear();
        }
    }

    return new SearchAdapter(mergedConfig);
}