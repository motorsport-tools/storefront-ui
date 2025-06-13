// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: [
    './domains/auth',
    './domains/recent-view-products',
    //'./domains/cart-odoo',
    './domains/cart-redis',
    './domains/category',
    './domains/checkout',
    './domains/core',
    './domains/my-account',
    './domains/product',
    './domains/orders',
    //'./domains/payment_rvvup',
    //'./domains/search-algolia',
    './domains/search-default',
    './domains/wishlist',
    './domains/live-chat',
    './domains/guest',
  ],

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
  app: {
    head: {
      viewport:
        "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=no",
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
    ],
    public: {
      odooBaseImageUrl: "",
      odooBaseUrl: "",
      currencySymbol: "",
      currencySeparator: "",
      currencyDecimal: "",
      currencyPrecision: "",
      posthogPublicKey: process.env.NUXT_POSTHOG_KEY,
      posthogHost: 'https://api.motorsport-tools.co.uk',
    },
  },

  googleFonts: {
    families: {
      "Poppins": [400, 500, 700],
      "Metrophobic": [400, 500, 700],
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

  routeRules: {
    "/": { swr: Number(process.env?.NUXT_SWR_CACHE_TIME) },
  },

  nitro: {
    // compressPublicAssets: true,
    storage: {
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
      },
      slug: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        ttl: process.env?.NUXT_SWR_CACHE_TIME || 3600,
      },
    },
    devStorage: {
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
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
    asyncContext: false,
  },

  sitemap: {
    sources: ['/api/sitemap/urls/products', '/api/sitemap/urls/categories'],
    runtimeCacheStorage: {
      driver: process.env.NUXT_STORAGE_DRIVER || '',
    }
  },

  robots: {
    allow: ['/category/*', '/product/*'],
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
