import {
    readItem,
    readSingleton,
    type RegularCollections
} from '@directus/sdk'

export default defineEventHandler(async (event) => {
    const globalsCollection = 'globals' as RegularCollections<String> 
    const navigationCollection = 'navigation' as RegularCollections<String>
	try {
		const [globals, /*headerNavigation, footerNavigation*/] = await Promise.all([
			directusServer.request(
				readSingleton(globalsCollection, {
					fields: ['social_links'],
				}),
			),
            /*
            directusServer.request(
				readItem(navigationCollection, 'main', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								'url',
								'type',
								{
									page: ['id', 'permalink'],
									post: ['id', 'slug'],
									children: ['id', 'title', 'url', 'type', {
										page: ['id', 'permalink'],
										post: ['id', 'slug']
									}],
								},
							],
						},
					],
					deep: {
						items: {
							_sort: ['sort'],
							children: {
								_sort: ['sort'],
							},
						},
					},
				}),
			),

			directusServer.request(
				readItem(navigationCollection, 'footer', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								'url',
								'type',
								{
									page: ['id', 'permalink'],
									post: ['id', 'slug'],
									children: ['id', 'title', 'url', 'type', {
										page: ['id', 'permalink'],
										post: ['id', 'slug']
									}],
								},
							],
						},
					],
					deep: {
						items: {
							_sort: ['sort'],
							children: {
								_sort: ['sort'],
							},
						},
					},
				}),
			),
            */
		]);

		return { globals, /*headerNavigation, footerNavigation*/ };
	} catch {
		throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
	}
})