// https://nuxt.com/docs/api/configuration/nuxt-config

const usingClarity = process.env.NUXT_CLARITY_ID ? true : false
const clarityId = process.env.NUXT_CLARITY_ID

export default defineNuxtConfig({
    runtimeConfig: {
		clarityId: '',
	},
	partytown: {
		forward: ['dataLayer.push'],
  	},
	app: {
        head: {
            link: [
				...(usingClarity ? [
                { rel: 'preload', as: 'script', href: '//www.clarity.ms/tag/'+clarityId}
				] : [])
            ],
        },
    },
});
