import {
	readItem,
	readSingleton,
	type RegularCollections
} from '@directus/sdk'

export default defineEventHandler(async (event) => {
	const globalsCollection = 'globals' as RegularCollections<String>
	const navigationCollection = 'navigation' as RegularCollections<String>
	try {
		const [globals, headerNavigation, footerNavigation] = await Promise.all([
			directusServer.request(
				readSingleton(globalsCollection, {
					fields: ['organization', 'social_links'],
				}),
			),

			directusServer.request(
				readItem(navigationCollection, 1, {
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
									children: ['id', 'title', 'url', 'type', {
										page: ['id', 'permalink'],
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
				readItem(navigationCollection, 2, {
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
									children: ['id', 'title', 'url', 'type', {
										page: ['id', 'permalink'],
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

		]);
		return { globals, headerNavigation, footerNavigation };
	} catch (error) {
		return { global: null, headerNavigation: null, footerNavigation: null };
	}
})