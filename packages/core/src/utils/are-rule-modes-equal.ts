import type { SyntaxRule } from '../syntax-rule'

export default function areRuleModesEqual(aSyntaxRule: SyntaxRule, bSyntaxRule: SyntaxRule) {
    return aSyntaxRule.mode === bSyntaxRule.mode
}