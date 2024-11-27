import css from '@master/eslint-config-css'
import htmlParser from '@angular-eslint/template-parser'
import mdx from 'eslint-plugin-mdx'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
    css,
    {
        rules: {
            '@master/css/class-validation': ['error', {
                disallowUnknownClass: true
            }],
        },
        settings: {
            'mdx/code-blocks': true,
        },
    },
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: htmlParser
        }
    },
    mdx.configs.flat,
    tseslint.configs.recommended,
)