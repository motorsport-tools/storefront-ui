// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/device",
    "@nuxtjs/google-fonts",
    "nuxt-lodash",
    "nuxt-icon",
    "nuxt-delay-hydration",
    "nuxt-typed-router",
    '@nuxtjs/robots',
    '@nuxt/eslint',
    'nuxt-viewport',
    '@nuxtjs/sitemap',
    '@nuxtjs/critters',
  ],
  routeRules: {
    '/payment/**': { cache: false },
    '/mail/**': { cache: false },
    '/my-account/**': { cache: false },
    '/my-account/order/*': { cache: false },
    '/my/orders/**': { cache: false },
    '/order/*': { cache: false },
    '/shop/*': { cache: false },
  },
  $production: {
    routeRules: {
      '/': { swr: Number(process.env?.NUXT_SWR_CACHE_TIME) },
      '/product/**': { swr: 300 }, //5 min
      '/my/orders/**': { cache: false },
      '/payment/**': { cache: false },
    },

  },
  security: {
    headers: {
      xFrameOptions: 'SAMEORIGIN',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', '*'],
        'script-src': ["'self'", "'unsafe-inline'", '*'],
        'connect-src': ["'self'", process.env.DIRECTUS_URL || ''],
        'frame-ancestors': ["'self'", process.env.DIRECTUS_URL || ''],
        'upgrade-insecure-requests': true,
      }
    },
  },
  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
      title: 'Motorsport-Tools.com - The Mk1 and Mk2 Ford Escort Rally Specialists',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [{ name: 'robots', content: 'noindex, nofollow' }],
    },
  },
  site: {
    url: '',
    name: 'Motorspor-Tools',
    defaultLocale: 'en',
  },
  robots: {
    allow: ['/*', '/product/*'],
    disallow: ['/cart', '/checkout/*', '/my-account/*', '/forgot-password', '/search?'],
  },

  runtimeConfig: {
    shouldByPassCacheQueryNames: [
      "LoadCartQuery",
      "WishlistLoadQuery",
      "GetAddressesQuery",
      "GetOrdersQuery",
      "LoadUserQuery",
      "PaymentPayQuery",
    ],
    public: {
      odooBaseImageUrl: "",
      odooBaseUrl: "",
      currencySymbol: "",
      currencySeparator: "",
      currencyDecimal: "",
      currencyPrecision: "",
      clerkApiKey: "",
      livechatChannelId: "",
    },
  },

  googleFonts: {
    families: {
      "Figtree": [300, 400, 500, 600, 700, 800],
    },
    display: 'swap',
  },

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
        language: "en-UK",
        country: "United Kingdom",
        countryCode: 'GB',
      },
    ],
    strategy: "no_prefix",
    lazy: true,
    defaultLocale: "en",
    vueI18n: "~/i18n.config.ts",
  },
  delayHydration: {
    mode: "init",
  },
  vite: {
    optimizeDeps: {
      include: ["lodash-es"],
    },
  },
  build: {
    transpile: [
      "tslib",
      "vue-toastification",
    ],
  },
  image: {
    providers: {
      odooProvider: {
        name: "odooProvider",
        provider: "~/providers/odoo-provider.ts",
      },
    },
    viewport: {
      breakpoints: {
        "2xl": 1536,
        xxl: 1440,
        xl: 1280,
        lg: 1024,
        md: 768,
        sm: 640,
        xs: 376,
        xxs: 0,
      },
    },
  },
  nitro: {
    compressPublicAssets: {
      gzip: true, brotli: true
    },
    //logLevel: 'debug',
    //sourceMap: true,
    storage: {
      cart: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 3600,
        preConnect: false,
      },
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: 14400,
        preConnect: false,
      },
      stock: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: 0,
        preConnect: false,
      },
      slug: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: 14400,
        preConnect: false,
      },
    },
    devStorage: {
      cart: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: 0,
      },
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: 0,
      },
      stock: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: 0,
      },
      slug: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 3600,
      },
    },
  },
  experimental: {
    crossOriginPrefetch: true,
    asyncContext: true,
  },
  sitemap: {
    sources: ['/api/sitemap/urls/products', '/api/sitemap/urls/categories'],
    cacheMaxAgeSeconds: 3600000,
    runtimeCacheStorage: {
      driver: process.env.NUXT_STORAGE_DRIVER || '',
      url: process.env.NUXT_STORAGE_URL,
      password: process.env.NUXT_STORAGE_PASSWORD,
      ttl: 3600000,
    }
  },
  tailwindcss: {
    viewer: false,
  },
  device: {
    refreshOnResize: true,
  },
  viewport: {
    breakpoints: {
      xxs: 375.9,
      xs: 376,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1440,
      "2xl": 1536,
    },

    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },

    fallbackBreakpoint: 'lg'
  },
  critters: {
    config: {
      preload: 'swap',
      pruneSource: true,
    },
  },

  devServer: {
    https: {
      key: process.env.NUXT_SERVER_KEY,
      cert: process.env.NUXT_SERVER_CERT,
    },
  },
  compatibilityDate: "2025-01-29",
});
