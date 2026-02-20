// https://nuxt.com/docs/api/configuration/nuxt-config
const toOrigin = (value?: string) => {
  if (!value) return ''
  try {
    return new URL(value).origin
  } catch {
    return value
  }
}

const odooOrigin = toOrigin(process.env.NUXT_PUBLIC_ODOO_BASE_URL)
const directusOrigin = toOrigin(process.env.DIRECTUS_URL)

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
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          'https:',
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https://js.stripe.com',
          'https://cdn.clerk.io',
          'https://checkout.dev.rvvuptech.com',
          'https://mautic.motorsport-tools.co.uk',
          odooOrigin,
        ].filter(Boolean),
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com',
        ],
        'font-src': [
          "'self'",
          'data:',
          'https://fonts.gstatic.com',
        ],
        'connect-src': [
          "'self'",
          odooOrigin,
          directusOrigin,
          'https://js.stripe.com',
          'https://api.stripe.com',
          'https://q.stripe.com',
          'https://r.stripe.com',
          'https://m.stripe.network',
          'https://cdn.clerk.io',
          'https://api.clerk.io',
          'https://pay.google.com',
          'https://apple-pay-gateway.apple.com',
          'https://applepay.cdn-apple.com',
          'https://www.paypal.com',
          'https://*.paypal.com',
          'https://*.klarna.com',
          'https://*.clearpay.co.uk',
          'https://*.afterpay.com',
        ].filter(Boolean),
        'frame-src': [
          "'self'",
          'https://js.stripe.com',
          'https://hooks.stripe.com',
          'https://pay.google.com',
          'https://applepay.cdn-apple.com',
          'https://www.paypal.com',
          'https://*.paypal.com',
          'https://*.klarna.com',
          'https://*.clearpay.co.uk',
          'https://*.afterpay.com',
        ],
        'worker-src': ["'self'", 'blob:'],
        'form-action': ["'self'"],
        'frame-ancestors': [
          "'self'",
          directusOrigin,
        ].filter(Boolean),
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
