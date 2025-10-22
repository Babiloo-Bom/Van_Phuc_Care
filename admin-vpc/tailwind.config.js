// Default config here: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js

const colors = require('tailwindcss/colors');

module.exports = {
    content: [],
    safelist: [{
        pattern: /bg-(prim|blue|orange|red|yellow|gray|green)-100/,
    }, {
        pattern: /border-(prim|blue|orange|red|yellow|gray|green)-100/,
    }],
    theme: {
        extend: {
            boxShadow: {
                '3xl': '0px 1px 0px #D7DAE7',
            },
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: colors.black,
            white: colors.white,
            prim: {
                100: '#1a77ba',
                20: '#d4dbf9',
            },
            success: {
                100: '#34c38f',
                20: '#ccf0e3',
            },
            info: {
                100: '#50a5f1',
                20: '#d3e8fb',
            },
            warning: {
                100: '#f1b44c',
                20: '#fbecd2',
            },
            danger: {
                100: '#f46a6a',
                20: '#fcdada',
            },
            dark: {
                100: '#343a40',
                20: '#cccecf',
            },
            second: {
                100: '#74788d',
                20: '#dcdde2',
            },
            gray: {
                100: '#212529',
                80: '#343a40',
                70: '#495057',
                60: '#74788d',
                50: '#adb5bd',
                40: '#ced4da',
                30: '#f6f6f6',
                20: '#eff2f7',
                10: '#f8f9fa',
            },
        },
        fontSize: {
            '2xs': ['10px', { lineHeight: '14px' }],
            xs: ['12px', { lineHeight: '18px' }],
            sm: ['13px', { lineHeight: '20px' }],
            base: ['14px', { lineHeight: '22px' }],
            lg: ['16px', { lineHeight: '24px' }],
            xl: ['18px', { lineHeight: '28px' }],
            '2xl': ['20px', { lineHeight: '30px' }],
            '3xl': ['24px', { lineHeight: '36px' }],
            '4xl': ['36px', { lineHeight: '48px' }],
            '5xl': ['39px', { lineHeight: '51px' }],
            '6xl': ['46px', { lineHeight: '54px' }],
            '7xl': ['56px', { lineHeight: '64px' }],
        },
        aspectRatio: {
            video: '16 / 9',
            square: '1 / 1',
        },
        borderRadius: {
            none: '0px',
            sm: '4px',
            DEFAULT: '8px',
            md: '10px',
            lg: '16px',
            xl: '20px',
            full: '9999px',
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
};
