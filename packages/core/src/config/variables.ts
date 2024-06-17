import colors from '@master/colors'
import extend from '@techor/extend'

const _variables = {
    full: '100%',
    fit: 'fit-content',
    max: 'max-content',
    min: 'min-content',
    screen: {
        '4xs': 360,
        '3xs': 480,
        '2xs': 600,
        'xs': 768,
        'sm': 834,
        'md': 1024,
        'lg': 1280,
        'xl': 1440,
        '2xl': 1600,
        '3xl': 1920,
        '4xl': 2560,
    },
    'font-family': {
        mono: [
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            'Liberation Mono',
            'Courier New',
            'monospace'
        ],
        sans: [
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'Noto Sans',
            'sans-serif',
            'Apple Color Emoji',
            'Segoe UI Emoji',
            'Segoe UI Symbol',
            'Noto Color Emoji'
        ],
        serif: [
            'ui-serif',
            'Georgia',
            'Cambria',
            'Times New Roman',
            'Times',
            'serif'
        ]
    },
    'font-weight': {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        heavy: 900
    },
    'flex-direction': {
        col: 'column',
        'col-reverse': 'column-reverse'
    },
    'box-sizing': {
        content: 'content-box',
        border: 'border-box'
    },
    position: {
        abs: 'absolute',
        rel: 'relative'
    },
    'transform-box': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box',
        fill: 'fill-box',
        stroke: 'stroke-box',
        view: 'view-box'
    },
    'animation-direction': {
        alt: 'alternate',
        'alt-reverse': 'alternate-reverse'
    },
    'background-clip': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box'
    },
    'background-origin': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box'
    },
    order: {
        first: -999999,
        last: 999999
    },
    'shape-outside': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box',
        margin: 'margin-box'
    },
    'clip-path': {
        content: 'content-box',
        border: 'border-box',
        padding: 'padding-box',
        margin: 'margin-box',
        fill: 'fill-box',
        stroke: 'stroke-box',
        view: 'view-box'
    },
    current: 'currentColor',
    white: '#ffffff',
    black: '#000000',
    base: {
        '@light': '$(white)',
        '@dark': '$(gray-95)',
    },
    canvas: {
        '@light': '$(slate-5)',
        '@dark': '$(gray-90)',
    },
    surface: {
        '@light': '$(white)',
        '@dark': '$(gray-80)',
    },
    invert: {
        '@light': '$(black)',
        '@dark': '$(white)',
    },
    line: {
        neutral: {
            '@light': '$(slate-60)',
            '@dark': '$(gray-30)',
        },
    },
    gray: {
        '@light': '$(gray-30)',
        '@dark': '$(gray-40)',
    },
    slate: {
        '@light': '$(slate-30)',
        '@dark': '$(slate-40)',
    },
    brown: {
        '@light': '$(brown-40)',
        '@dark': '$(brown-50)',
    },
    orange: {
        '@light': '$(orange-40)',
        '@dark': '$(orange-50)',
    },
    amber: {
        '@light': '$(amber-40)',
        '@dark': '$(amber-50)',
    },
    yellow: {
        '@light': '$(yellow-40)',
        '@dark': '$(yellow-50)',
    },
    lime: {
        '@light': '$(lime-40)',
        '@dark': '$(lime-50)',
    },
    green: {
        '@light': '$(green-40)',
        '@dark': '$(green-50)',
    },
    beryl: {
        '@light': '$(beryl-40)',
        '@dark': '$(beryl-50)',
    },
    teal: {
        '@light': '$(teal-40)',
        '@dark': '$(teal-50)',
    },
    cyan: {
        '@light': '$(cyan-40)',
        '@dark': '$(cyan-50)',
    },
    sky: {
        '@light': '$(sky-60)',
        '@dark': '$(sky-50)',
    },
    blue: {
        '@light': '$(blue-60)',
        '@dark': '$(blue-50)',
    },
    indigo: {
        '@light': '$(indigo-60)',
        '@dark': '$(indigo-50)',
    },
    violet: {
        '@light': '$(violet-60)',
        '@dark': '$(violet-50)',
    },
    purple: {
        '@light': '$(purple-60)',
        '@dark': '$(purple-50)',
    },
    fuchsia: {
        '@light': '$(fuchsia-60)',
        '@dark': '$(fuchsia-50)',
    },
    pink: {
        '@light': '$(pink-60)',
        '@dark': '$(pink-50)',
    },
    crimson: {
        '@light': '$(crimson-60)',
        '@dark': '$(crimson-50)',
    },
    red: {
        '@light': '$(red-60)',
        '@dark': '$(red-50)',
    },
    text: {
        invert: {
            '@light': '$(white)',
            '@dark': '$(black)',
        },
        strong: {
            '@light': '$(slate-95)',
            '@dark': '$(gray-10)',
        },
        neutral: {
            '@light': '$(slate-70)',
            '@dark': '$(gray-30)',
        },
        lightest: {
            '@light': '$(slate-30)',
            '@dark': '$(gray-60)',
        },
        lighter: {
            '@light': '$(slate-40)',
            '@dark': '$(gray-50)',
        },
        light: {
            '@light': '$(slate-50)',
            '@dark': '$(gray-40)',
        },
        gray: {
            '@light': '$(gray-60)',
            '@dark': '$(gray-30)',
        },
        slate: {
            '@light': '$(slate-60)',
            '@dark': '$(slate-30)',
        },
        brown: {
            '@light': '$(brown-60)',
            '@dark': '$(brown-30)',
        },
        orange: {
            '@light': '$(orange-60)',
            '@dark': '$(orange-30)',
        },
        amber: {
            '@light': '$(amber-60)',
            '@dark': '$(amber-40)',
        },
        yellow: {
            '@light': '$(yellow-60)',
            '@dark': '$(yellow-40)',
        },
        lime: {
            '@light': '$(lime-70)',
            '@dark': '$(lime-40)',
        },
        green: {
            '@light': '$(green-70)',
            '@dark': '$(green-40)',
        },
        beryl: {
            '@light': '$(beryl-70)',
            '@dark': '$(beryl-40)',
        },
        teal: {
            '@light': '$(teal-70)',
            '@dark': '$(teal-40)',
        },
        cyan: {
            '@light': '$(cyan-70)',
            '@dark': '$(cyan-40)',
        },
        sky: {
            '@light': '$(sky-70)',
            '@dark': '$(sky-30)',
        },
        blue: {
            '@light': '$(blue-60)',
            '@dark': '$(blue-30)',
        },
        indigo: {
            '@light': '$(indigo-60)',
            '@dark': '$(indigo-30)',
        },
        violet: {
            '@light': '$(violet-60)',
            '@dark': '$(violet-30)',
        },
        purple: {
            '@light': '$(purple-60)',
            '@dark': '$(purple-30)',
        },
        fuchsia: {
            '@light': '$(fuchsia-60)',
            '@dark': '$(fuchsia-30)',
        },
        pink: {
            '@light': '$(pink-60)',
            '@dark': '$(pink-30)',
        },
        crimson: {
            '@light': '$(crimson-60)',
            '@dark': '$(crimson-30)',
        },
        red: {
            '@light': '$(red-60)',
            '@dark': '$(red-30)',
        },
    },
}

const variables = extend(colors, _variables) as (typeof colors & typeof _variables)

export default variables