// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
		public: {
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL as string,
			directusUrl: process.env.DIRECTUS_URL as string,
			enableVisualEditing: process.env.NUXT_PUBLIC_ENABLE_VISUAL_EDITING !== 'false',
		},
		directusServerToken: process.env.DIRECTUS_SERVER_TOKEN,
	},
    security: {
		headers: {
			contentSecurityPolicy: {
				'img-src': ["'self'", 'data:', '*'],
				'script-src': ["'self'", "'unsafe-inline'", '*'],
				'connect-src': ["'self'", process.env.DIRECTUS_URL || ''],
				'frame-ancestors': ["'self'", process.env.DIRECTUS_URL || ''],
			},
		},
	},
});
