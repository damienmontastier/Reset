import webpack from 'webpack'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default {
  version: uuidv4(),
  mode: 'universal',
  /*
   ** Headers of the page
   */
  generate: {
    routes: ['level1'],
    fallback: ''
  },
  head: {
    title: 'nuxt-three',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: ''
      },
      {
        ref: `canonical`,
        href: ''
      },
      {
        hid: `og:title`,
        property: 'og:title',
        content: ''
      },
      {
        hid: `og:url`,
        property: 'og:url',
        content: ''
      },
      {
        hid: `og:image`,
        property: 'og:image',
        content: ''
      },
      {
        hid: `og:description`,
        property: 'og:description',
        content: ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ],
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: false,
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/index.scss'],
  styleResources: {
    scss: ['@/assets/scss/config.scss', '@/assets/scss/modules/index.scss']
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/events.js', mode: 'client' },
    { src: '~/plugins/viewport.js', mode: 'client' },
    { src: '~/plugins/mouse.js', mode: 'client' },
    { src: '~/plugins/keyboard.js', mode: 'client' },
    { src: '~/plugins/controller.js', mode: 'client' },
    { src: '~/plugins/directives.js', mode: 'client' },
    { src: '~/plugins/window-focus.js', mode: 'client' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    [
      '@nuxtjs/stylelint-module',
      {
        fix: true
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    'nuxt-helmet',
    'nuxt-ssr-cache',
    'nuxt-compress'
  ],
  'nuxt-compress': {
    gzip: {
      cache: true
    },
    brotli: {
      threshold: 10240
    }
  },
  cache: {
    // if you're serving multiple host names (with differing
    // results) from the same server, set this option to true.
    // (cache keys will be prefixed by your host name)
    // if your server is behind a reverse-proxy, please use
    // express or whatever else that uses 'X-Forwarded-Host'
    // header field to provide req.hostname (actual host name)
    useHostPrefix: false,
    pages: [],
    store: {
      type: 'memory',

      // maximum number of pages to store in memory
      // if limit is reached, least recently used page
      // is removed.
      max: 100,

      // number of seconds to store this page in cache
      ttl: 120
    }
  },
  helmet: {
    dnsPrefetchControl: true,
    expectCt: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: {
      // Must be at least 1 year to be approved
      maxAge: 31536000,

      // Must be enabled to be approved
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true
  },
  router: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.plugins.push(new webpack.ProvidePlugin({ THREE: 'three' }))

      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })

      config.module.rules.push({
        test: /\.(glsl|vs|fs)$/,
        loader: 'raw-loader'
      })
    },

    babel: {
      presets({ isServer }) {
        return [
          [
            '@babel/preset-env',
            {
              targets: '> 2%, not dead'
            }
          ]
        ]
      }
    }
  }
}
