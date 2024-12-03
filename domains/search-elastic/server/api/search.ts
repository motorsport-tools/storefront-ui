import { Client } from '@elastic/elasticsearch';

const runtimeConfig = useRuntimeConfig()

// Initialize ElasticSearch client
const elasticHost = runtimeConfig.elastic.hostname || ""
const elasticIndex = runtimeConfig.elastic.index || ""
const elasticApi = runtimeConfig.elastic.apiKey || ""

const client = new Client({
    node: elasticHost,
    auth: {
        apiKey: elasticApi
    },
  });

export default defineEventHandler(async (event: any) => {

    // Get the query parameter from the URL
    const { query } = getQuery(event);

    if (!query) {
        return {
        error: 'Query parameter is required',
        };
    }
    try {
        const response = await client.search({
            index: elasticIndex,
            query: {
                bool: {
                should: [
                    {
                    match_phrase: {
                        default_code: query  // Exact match for SKU
                    }
                    },
                    {
                    query_string: {
                        query: "*"+query+"*",
                        fields: ['name^2', 'description_sale'],  // Boost name for higher relevance
                        fuzziness: 'AUTO', 
                        default_operator: 'AND', 
                        analyze_wildcard: true,  
                        auto_generate_synonyms_phrase_query: false,
                        boost: 2.0,  // Boost overall query relevance
                        phrase_slop: 2 
                    }
                    }
                ],
                filter: [
                    { term: { active: true } },  
                    { term: { website_published: true } }  
                ],
                minimum_should_match: 1 
                }
            }
        });

        return response.hits.hits.map(hit => hit._source);

    } catch (error: unknown) {
        console.error('ElasticSearch error:', error);
        return {
            error: 'Search failed',
        };
    }
});