import plugin from './plugin'
import settings from './settings'

const parserOptions = {
    ecmaFeatures: {
        jsx: true
    }
}

const rules = {
    '@master/css/class-order': 'warn',
    '@master/css/class-validation': 'error',
    '@master/css/class-collision': 'warn'
}

/** @type {import('typescript-eslint').Config} */
export default {
    ...plugin,
    configs: {
        recommended: {
            plugins: ['@master/css'],
            rules,
            parserOptions
        },
        flat: {
            plugins: {
                '@master/css': plugin
            },
            rules,
            languageOptions: {
                parserOptions
            }
        }
    },
    settings
}