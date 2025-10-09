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
                    },
                    limit: 1,
                    fields: [
                        'title',
                        'id',
                        'permalink',
                        'seo',
                        'sections',
                        'sections.item.*',
                        'sections.item.blocks.*',
                        'sections.item.blocks.item.*',
                        'sections.item.blocks.item.items.*',
                        'sections.item.blocks.item.items.item.*',
                        'sections.item.blocks.item.items.item.image.id',
                        'sections.item.blocks.item.items.item.image.width',
                        'sections.item.blocks.item.items.item.image.height',
                        'sections.item.blocks.item.slider_slides.*',
                        'sections.item.blocks.item.slider_slides.background_image.id',
                        'sections.item.blocks.item.slider_slides.background_image.title',
                        'sections.item.blocks.item.section_content.item.*',
                        'sections.item.blocks.item.section_content.item.background_image.id',
                        'sections.item.blocks.item.section_content.item.background_image.title',

                    ],
                    deep: {
                        sections: {
                            item: {
                                _sort: ['sort'],
                                blocks: {
                                    item: {
                                        _filter: {
                                            _sort: ['sort'],
                                        },
                                        slider_slides: {
                                            background_image: {
                                                _fields: ['id', 'title']
                                            }
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
            ),
        )

        if (!pageData.length) {
            throw createError({ statusCode: 404, statusMessage: 'Page not found' })
        }

        const page = pageData[0]

        return page
    } catch {
        throw createError({ statusCode: 500, statusMessage: 'Page not found' })
    }
})