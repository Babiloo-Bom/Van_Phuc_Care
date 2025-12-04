require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Helper function to get API host - for SPA, we'll use relative URL or window.location
const getApiHost = () => {
    // During build, use env var or empty string (will be resolved at runtime)
    if (process.env.API_HOST) {
        return process.env.API_HOST;
    }
    // For production SPA, use relative path so browser resolves correctly
    return isProduction ? '/api' : 'http://localhost:3000/api';
};

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
        title: 'Vạn Phúc Care - Admin',
        titleTemplate: '%s',
        htmlAttrs: {
            lang: 'vie',
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
            // Apple Touch Icons
            {
                hid: 'apple-touch-icon-180', name: 'apple-touch-icon', sizes: '180x180', content: 'https://cdn.synck.io.vn/vanphuccare/logo/apple-touch-icon-180x180.png',
            },
            {
                hid: 'apple-touch-icon-167', name: 'apple-touch-icon', sizes: '167x167', content: 'https://cdn.synck.io.vn/vanphuccare/logo/apple-touch-icon-167x167.png',
            },
            {
                hid: 'apple-touch-icon-152', name: 'apple-touch-icon', sizes: '152x152', content: 'https://cdn.synck.io.vn/vanphuccare/logo/apple-touch-icon-152x152.png',
            },
            {
                hid: 'apple-touch-icon-120', name: 'apple-touch-icon', sizes: '120x120', content: 'https://cdn.synck.io.vn/vanphuccare/logo/apple-touch-icon-120x120.png',
            },
            {
                hid: 'apple-touch-icon-76', name: 'apple-touch-icon', sizes: '76x76', content: 'https://cdn.synck.io.vn/vanphuccare/logo/apple-touch-icon-76x76.png',
            },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/images/logo.png' },
            { rel: 'apple-touch-icon', href: 'https://cdn.synck.io.vn/vanphuccare/logo/apple-touch-icon-180x180.png' },
        ],
    },

    css: [
        '@/assets/main.scss',
        '@/assets/ant/main.less',
        '@fortawesome/fontawesome-free/css/all.css',
    ],

    plugins: [
        '@/plugins/api',
        '@/plugins/ant-design',
        '@/plugins/filters',
        '@/plugins/helpers',
        '@/plugins/global-components',
        '@/plugins/VueCoolBox.js',
        { src: '@/plugins/axios', mode: 'client' },
        { src: '@/plugins/google-maps', mode: 'client' },
    ],

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
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
    ],

    axios: {
        baseURL: getApiHost(),
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
                        url: '/a/sessions/login',
                        method: 'POST',
                    },
                    logout: false,
                    user: {
                        url: '/a/sessions/current_admin',
                        method: 'GET',
                    },
                },
                redirect: {
                    login: '/login',
                    logout: '/',
                    callback: '/login',
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
    },

    publicRuntimeConfig: {
        googleAnalytics: {
            id: process.env.GOOGLE_ANALYTICS_ID,
        },
    },

    env: {
        API_HOST: getApiHost(),
        RSA_PUBLIC_KEY: process.env.RSA_PUBLIC_KEY,
        TINYMCE_KEY: process.env.TINYMCE_KEY,
        IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    },
};
