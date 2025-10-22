require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

export default {
    dev: !isProduction,

    ssr: false,
    target: 'static',
    generate: {
        fallback: true,
    },

    // When SPA
    loading: '@/components/shared/Loading.vue',

    // When SSR
    loadingIndicator: {
        name: 'faded-circle',
        color: '#336CCE',
    },

    head: {
        title: 'Vạn Phúc Care',
        titleTemplate: '%s',
        htmlAttrs: {
            lang: 'en',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' },
        ],
    },

    googleFonts: {
        families: {
            'Be+Vietnam+Pro': [300, 400, 500, 600],
        },
    },

    css: [
        '@/assets/main.scss',
        '@/assets/ant/main.less',
        '@fortawesome/fontawesome-free/css/all.css',
    ],

    plugins: [
        '@/plugins/api',
        '@/plugins/ant-design',
        '@/plugins/i18n',
        '@/plugins/filters',
        '@/plugins/helpers',
        '@/plugins/global-components',
        { src: '@/plugins/axios', mode: 'client' },
        { src: '@/plugins/google-maps', mode: 'client' },
        { src: '@/plugins/apex-chart', ssr: false },
    ],
    i18n: {
        detectBrowserLanguage: false,
        strategy: 'no_prefix',
        nuxtI18n: false,
        defaultLocale: 'vn',
        lazy: true,
        langDir: 'lang/',
        locales: [{
            code: 'vn',
            file: 'vn.js',
        }],
    },

    robots: [
        {
            UserAgent: '*',
            Disallow: process.env.APP_ENV === 'production'
                ? [
                    '/*.json',
                    '/*.xml',
                ]
                : '/',
        },
    ],
    server: {
        // https: {
        //     key: require('fs').readFileSync('./localhost-key.pem'),
        //     cert: require('fs').readFileSync('./localhost.pem'),
        // },
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || '4000',
    },

    render: {
        http2: {
            push: true,
        },
    },

    buildModules: [
        '@nuxt/postcss8',
        '@nuxtjs/eslint-module',
        '@nuxtjs/fontawesome',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
        '@nuxtjs/google-analytics',
        'vue2-editor/nuxt',
    ],

    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        '@nuxtjs/i18n',
        'nuxt-socket-io',
    ],
    axios: {
        baseURL: process.env.API_HOST,
    },

    auth: {
        strategies: {
            local: {
                token: {
                    property: 'data.accessToken',
                    global: true,
                    required: true,
                    maxAge: 60 * 60 * 24 * 30,
                    type: 'Bearer',
                },
                autoLogout: false,
                user: {
                    property: 'data.admin',
                    autoFetch: true,
                },
                endpoints: {
                    login: {
                        url: `${process.env.API_HOST}/a/sessions/login`,
                        method: 'POST',
                    },
                    logout: false,
                    user: {
                        url: `${process.env.API_HOST}/a/sessions/current_admin`,
                        method: 'GET',
                    },
                },
                redirect: {
                    login: '/login',
                    logout: '/',
                    // callback: '/login',
                    home: '/',
                },
            },
        },
    },

    router: {
        middleware: ['auth'],
    },

    build: {
        transpile: [/^vue2-google-maps($|\/)/],
        postcss: {
            plugins: {
                tailwindcss: 'tailwind.config.js',
                autoprefixer: {},
                ...(process.env.APP_ENV === 'production' ? { cssnano: {} } : {}),
            },
        },
        loaders: {
            less: {
                javascriptEnabled: true,
            },
        },
        babel: {
            plugins: [
                [
                    'import',
                    {
                        libraryName: 'ant-design-vue',
                        libraryDirectory: 'es',
                        style: true,
                    },
                    'ant-design-vue',
                ],
            ],
        },
        vendor: [
            'apex-chart',
        ],
    },

    publicRuntimeConfig: {
        googleAnalytics: {
            id: process.env.GOOGLE_ANALYTICS_ID,
        },
    },

    env: {
        API_HOST: process.env.API_HOST || 'localhost',
        RSA_PUBLIC_KEY: process.env.RSA_PUBLIC_KEY,
        TINYMCE_KEY: process.env.TINYMCE_KEY,
        IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
};
