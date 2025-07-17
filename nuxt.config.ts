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
    "nuxt-clarity-analytics",
    '@nuxtjs/robots',
    '@nuxt/eslint',
    'nuxt-viewport',
    '@nuxtjs/sitemap',
  ],
  $production: {
    routeRules: {
      '/': { swr: Number(process.env?.NUXT_SWR_CACHE_TIME) },
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
    description: 'Welcome to an awesome ecommerce site!',
    defaultLocale: 'en',
  },

  runtimeConfig: {
    shouldByPassCacheQueryNames: [
      "LoadCartQuery",
      "WishlistLoadQuery",
      "GetAddressesQuery",
      "GetOrdersQuery",
      "LoadUserQuery",
    ],
    public: {
      odooBaseImageUrl: "",
      odooBaseUrl: "",
      middlewareUrl: '',
      currencySymbol: "",
      currencySeparator: "",
      currencyDecimal: "",
      currencyPrecision: "",
      clerkApiKey: "",
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
    legacy: false,
    locales: [
      {
        code: "en",
        name: "English",
        file: "en.json",
        language: "en-UK",
        country: "United Kingdom",
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
    screens: {
      "2xl": 1536,
      xxl: 1440,
      xl: 1280,
      lg: 1024,
      md: 768,
      sm: 640,
      xs: 376,
    },
  },

  nitro: {
    compressPublicAssets: {
      gzip: true, brotli: true
    },
    //logLevel: 'debug',
    sourceMap: true,
    storage: {
      cart: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 0,
        lazyConnect: true,
      },
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
        lazyConnect: true,
      },
      stock: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 3600,
        lazyConnect: true,
      },
      slug: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 3600,
        lazyConnect: true,
      },
    },
    devStorage: {
      cart: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 0,
      },
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
      },
      stock: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 3600,
      },
      slug: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
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
    runtimeCacheStorage: {
      driver: process.env.NUXT_STORAGE_DRIVER || '',
    }
  },

  robots: {
    allow: ['/*', '/product/*'],
    disallow: ['/cart', '/checkout/*', '/my-account/*', '/forgot-password', '/search?'],
  },

  tailwindcss: {
    viewer: false,
  },

  device: {
    refreshOnResize: true,
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
