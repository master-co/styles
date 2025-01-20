import { SyntaxRule } from '../syntax-rule'

export default function areRulesDuplicated(aSyntaxRule: SyntaxRule, bSyntaxRule: SyntaxRule) {
    const aKeys = Object.keys(aSyntaxRule.declarations || {})
    const bKeys = Object.keys(bSyntaxRule.declarations || {})

    if (aKeys.length !== bKeys.length) {
        return false
    }

    for (const key of aKeys) {
        if (!Object.prototype.hasOwnProperty.call(bSyntaxRule.declarations, key)) {
            return false
        }
    }

    return true
}