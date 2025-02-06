// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      viewport: "minimum-scale=1, initial-scale=1, width=device-width",
      title: "Motorsport-Tools.com - The Mk1 and Mk2 Ford Escort Rally Specialists",
      htmlAttrs: {
        lang: "en",
      },
      meta: [{ name: "robots", content: "index, follow" }],
    },
  },

  robots: {
    allow: "/category/*",
  },

  extends: [
    "./domains/auth",
    "./domains/recent-view-products",
    //"./domains/cart-odoo",
    "./domains/cart-redis",
    "./domains/category",
    "./domains/checkout",
    "./domains/core",
    "./domains/my-account",
    "./domains/product",
    "./domains/payment_rvvup",
    //"./domains/search-algolia",
    "./domains/search-default",
    "./domains/wishlist",
    "./domains/live-chat",
  ],

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/device",
    "@nuxtjs/i18n",
    "@nuxtjs/google-fonts",
    "nuxt-lazy-hydrate",
    "nuxt-lodash",
    "nuxt-icon",
    "nuxt-delay-hydration",
    "nuxt-typed-router",
  ],

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
    },
  },

  googleFonts: {
    families: {
      "Red Hat Display": [400, 500, 700],
    },
  },

  i18n: {
    locales: [
      {
        code: "en",
        file: "en.json",
      },
    ],
    strategy: "no_prefix",
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
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
      "@apollo/client",
      "@apollo/client/core",
      "@vue/apollo-composable",
      "@vue/apollo-option",
      "ts-invariant",
      "vue-toastification",
      "@erpgap/odoo-sdk-api-client",
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
    "/category/*": { swr: Number(process.env?.NUXT_SWR_CACHE_TIME) },
    "/product/*": { swr: Number(process.env?.NUXT_SWR_CACHE_TIME) },
  },

  nitro: {
    // compressPublicAssets: true,
    storage: {
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
      },
    },
    devStorage: {
      cache: {
        driver: process.env.NUXT_STORAGE_DRIVER,
        url: process.env.NUXT_STORAGE_URL,
        password: process.env.NUXT_STORAGE_PASSWORD,
      },
    },
  },
  experimental: {
    crossOriginPrefetch: true,
  },
  site: {
    url: "https://vsfsdk.labs.odoogap.com/",
    name: "ERPGAP VSF",
    description: "Welcome to an awesome ecommerce site!",
    defaultLocale: "en",
  },

  tailwindcss: {
    viewer: false,
  },

  device: {
    refreshOnResize: true,
  },

  experimental: {
    asyncContext: false,
  },

  devServer: {
    https: {
      key: process.env.NUXT_SERVER_KEY,
      cert: process.env.NUXT_SERVER_CERT,
    },
  },

  compatibilityDate: "2025-01-29",
});