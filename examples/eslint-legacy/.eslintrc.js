const { resolve } = require('node:path')

/** @type {import('eslint').Linter.LegacyConfig} */
module.exports = {
    extends: [
        '@master/css',
    ],
    settings: {
        '@master/css': {
            config: resolve(__dirname, 'master.css')
        }
    },
    overrides: [
        {
            files: [ '*.html'],
            parser: '@angular-eslint/template-parser'
        }
    ],
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    }
}