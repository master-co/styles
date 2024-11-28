import css from '@master/eslint-config-css'
import htmlParser from "@angular-eslint/template-parser"
import tsParser from '@typescript-eslint/parser'
import mdx from 'eslint-plugin-mdx'

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: htmlParser
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser
        }
    },
    mdx.flat,
    css,
    {
        rules: {
            '@master/css/class-validation': ['error', {
                disallowUnknownClass: true
            }],
        },
        settings: {
            'mdx/code-blocks': true
        },
    },
]