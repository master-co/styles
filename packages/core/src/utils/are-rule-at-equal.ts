import type { SyntaxRule } from '../syntax-rule'

export default function areRuleAtEqual(aSyntaxRule: SyntaxRule, bSyntaxRule: SyntaxRule) {
    const aQueryTypes = Object.keys(aSyntaxRule.at)
    const bQueryTypes = Object.keys(bSyntaxRule.at)

    if (aQueryTypes.length !== bQueryTypes.length) {
        return false
    }

    for (const aQueryType of aQueryTypes) {
        const aAtComponents = aSyntaxRule.at[aQueryType]
        const bAtComponents = bSyntaxRule.at[aQueryType]
        for (const aAtComponent of aAtComponents) {
            const aAtComponentToken = aSyntaxRule.resolveAtComponent(aAtComponent)
            if (!bAtComponents.find(bAtComponent => bSyntaxRule.resolveAtComponent(bAtComponent) === aAtComponentToken)) {
                return false
            }
        }
    }
    return true
}