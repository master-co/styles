import nextCoreWebVitals from '@next/eslint-plugin-next/lib/configs/core-web-vitals'
import next from '@next/eslint-plugin-next/lib/configs/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'
import css from '@master/eslint-config-css'

export default [
    css,
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            react: react,
            'react-hooks': reactHooks,
            '@next/next': next,
            'next/core-web-vitals': nextCoreWebVitals
        },
        rules: {
            ...reactPlugin.configs['jsx-runtime'].rules,
            ...hooksPlugin.configs.recommended.rules,
            ...next.configs.recommended.rules,
            ...next.configs['core-web-vitals'].rules,
            '@next/next/no-img-element': 'error',
            'import/no-anonymous-default-export': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@next/next/google-font-display': 'off',
            '@next/next/google-font-preconnect': 'off',
            '@next/next/no-page-custom-font': 'off',
            'no-html-link-for-pages': 'off',
            'react/display-name': 'off'
        },
    }
]