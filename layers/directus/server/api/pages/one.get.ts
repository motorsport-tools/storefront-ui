import { withoutTrailingSlash, withLeadingSlash } from 'ufo';
import {type RegularCollections } from '@directus/sdk'

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	// Handle live preview
	const { preview, token: rawToken, permalink: rawPermalink } = query;

	// Ensure the permalink is formatted correctly
	const permalink = withoutTrailingSlash(withLeadingSlash(String(rawPermalink)));

	const token = preview === 'true' && rawToken ? String(rawToken) : null;

    const collection = 'pages' as RegularCollections<String> 

	try {
		const pageData = await directusServer.request(
			withToken(
				token as string,
				readItems(collection, {
					filter: { 
                        permalink: { _eq: permalink },
                        //status: { _eq: 'published' } 
                    },
					limit: 1,
					fields: [
						'title',
						'id',
                        'permalink',
					],
                    /*
					deep: {
						blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
					},
                    */
				}),
			),
		)
        console.log(pageData)
        
		if (!pageData.length) {
			throw createError({ statusCode: 404, statusMessage: 'Page not found' })
		}

        const page = pageData[0]

        return page
    } catch {
		throw createError({ statusCode: 500, statusMessage: 'Page not found' })
	}
})