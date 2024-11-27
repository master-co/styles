import type { Linter } from 'eslint'
import base from './base'

export default {
    ...base,
    rules: {
        '@master/css/class-order': 'warn',
        '@master/css/class-validation': 'error',
        '@master/css/class-collision': 'warn'
    },
} as Linter.Config