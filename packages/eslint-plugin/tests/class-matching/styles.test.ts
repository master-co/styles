import rule from '../../src/rules/class-validation'
import { RuleTester } from '@typescript-eslint/rule-tester'

new RuleTester({
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        }
    }
}).run('class matching styles', rule, {
    valid: [
        { code: 'export default { styles: { btn: "block" } }' }
    ],
    invalid: [
        { code: 'export default { styles: { btn: "bg:error" } }', errors: [{ messageId: 'invalidClass' }] },
        { code: 'export default { styles: { btn: { primary: "bg:error" } } }', errors: [{ messageId: 'invalidClass' }] },
        { code: 'const styles = "bg:error"', errors: [{ messageId: 'invalidClass' }] },
        { code: 'const styles = { btn: { primary: "bg:error" } }', errors: [{ messageId: 'invalidClass' }] },
    ]
})