import rule from '../../src/rules/class-validation'
import { RuleTester } from '@typescript-eslint/rule-tester'

new RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            }
        }
    }
}).run('class matching components', rule, {
    valid: [
        { code: 'export default { components: { btn: "block" } }' },
        { code: 'export default { components: { btn: { xs: "font: 12 h: 6x px: 2x r: 2x", rounded: { xs: "font: 12 h: 6x px: 2x r: 2x" } } } }' }
    ],
    invalid: [
        { code: 'export default { components: { btn: "bg:error" } }', errors: [{ messageId: 'invalidClass' }] },
        { code: 'export default { components: { btn: { primary: "bg:error" } } }', errors: [{ messageId: 'invalidClass' }] },
        { code: 'const components = "bg:error"', errors: [{ messageId: 'invalidClass' }] },
        { code: 'const components = { btn: { primary: "bg:error" } }', errors: [{ messageId: 'invalidClass' }] },
    ]
})