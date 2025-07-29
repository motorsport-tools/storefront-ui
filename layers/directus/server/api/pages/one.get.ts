import { withoutTrailingSlash, withLeadingSlash } from 'ufo';
import { type RegularCollections } from '@directus/sdk'

export default defineEventHandler(async (event) => {
	const query = getQuery(event);

	// Handle live preview
	const { preview, token: rawToken, permalink: rawPermalink } = query;

	// Ensure the permalink is formatted correctly
	const permalink = withoutTrailingSlash(withLeadingSlash(String(rawPermalink)));

	const token = preview === 'true' && rawToken ? String(rawToken) : null;

    const collection = 'Pages' as RegularCollections<String> 

	try {
        const pageData = await directusServer.request(
			withToken(
				token as string,
				readItems(collection, {
					filter: { 
                        permalink: { _eq: permalink },
                        status: { _eq: 'published' } 
                    },
					limit: 1,
					fields: [
						'title',
                        'id',
                        'permalink',
                        'sections',
                        'sections.item.*',
                        'sections.item.blocks.*',
                        'sections.item.blocks.item.*',
					],
					deep: {
						sections: { 
                            item: {
                                _sort: ['sort'], 
                                _filter: { 
                                    status: { _eq: 'published' } 
                                },
                                blocks: {
                                    item: {
                                        _filter: {
                                            _sort: ['sort'],
                                            status: { _eq: 'published' }
                                        }
                                    },
                                },
                            },
                        },
					},
				}),
			),
		)
        console.log('Directus Response: ', pageData)
        

		if (!pageData.length) {
			throw createError({ statusCode: 404, statusMessage: 'Page not found' })
		}

        const page = pageData[0]

        return page
    } catch {
		throw createError({ statusCode: 500, statusMessage: 'Page not found' })
	}
})