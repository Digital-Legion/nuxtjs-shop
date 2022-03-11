import redirectSSL from 'redirect-ssl'

export default {
  head: {
    title: 'proximart',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/styles/app.scss', '~/assets/styles/common.scss'],

  styleResources: {
    scss: ['./assets/styles/includes/colors.scss', './assets/styles/includes/mixins.scss']
  },

  extend(config) {
    config.resolve.symlinks = false
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/bus",
    "~/plugins/swiper",
    "~/plugins/loading",
    "~/plugins/components",
    "~/plugins/click-outside",
    "~/plugins/textarea-autosize",
    "~/plugins/vue-scrollto",
    {src: "~/plugins/v-mask"},
    {src: "~/plugins/vBodyScrollLock.client.js"},
    {src: "~/plugins/youtube", ssr: false},
    {src: '~/plugins/zoom', ssr: false}
  ],

  serverMiddleware: [
    redirectSSL.create({
      enabled: process.env.NODE_ENV === 'production'
    }),
  ],

  webfontloader: {
    google: {
      families: [
        'Inter:100,200,300,400,500,600,700,800,900'
      ]
    }
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  // components: {
  //   dirs: [
  //     '~/components',
  //     '~/components/elements',
  //     '~/containers'
  //   ]
  // },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/svg",
    ['@nuxtjs/dotenv',
      { filename: '.env' }
    ],
    ['nuxt-lazy-load', {
      directiveOnly: true
    }]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources',
    'nuxt-i18n',
    '@nuxtjs/axios',
    'nuxt-webfontloader',
    '@nuxtjs/dotenv',
    'nuxt-lazy-load',
    '@nuxtjs/toast',
    'cookie-universal-nuxt'
  ],

  toast: {
    position: 'bottom-center',
    duration: 10000
  },

  i18n: {
    seo: true,
    locales: [
      {code: 'ru', iso: 'ru-RU', file: 'ru.json'},
      {code: 'az', iso: 'az-AZ', file: 'az.json'}
    ],
    defaultLocale: 'ru',
    vueI18n: {
      fallbackLocale: 'ru',
    },
    lazy: true,
    langDir: 'locales/'
  },

  axios: {
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3001/api'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    },
    // cssSourceMap: process.env.NODE_ENV == 'production',
    // extractCSS: process.env.NODE_ENV == 'production',
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /.(css|vue)$/,
            chunks: "all",
            enforce: true
          }
        }
      }
    },
    postcss: {
      plugins: {
        // Disable postcss-url
        'postcss-url': false,
        // Add some plugins
        'postcss-nested': {},
        'postcss-responsive-type': {},
        'postcss-hexrgba': {}
      },
      preset: {
        autoprefixer: {
          grid: true
        }
      }
    }
  }
}
