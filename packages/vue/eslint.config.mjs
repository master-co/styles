import common from '../../eslint.config.mjs'
import techor from 'eslint-config-techor'
import vue from 'eslint-plugin-vue'

export default [
    ...common,
    techor.configs.typescript,
    ...vue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        rules: {
            'vue/multi-word-component-names': 'off'
        },
        languageOptions: {
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        }
    }
]
