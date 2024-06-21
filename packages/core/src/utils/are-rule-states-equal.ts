import type { SyntaxRule } from '../syntax-rule'
import areRuleSelectorsEqual from './are-rule-selectors-equal'
import areRuleModesEqual from './are-rule-modes-equal'
import areRuleAtEqual from './are-rule-at-equal'

export default function areRuleStatesEqual(aSyntaxRule: SyntaxRule, bSyntaxRule: SyntaxRule) {
    return areRuleSelectorsEqual(aSyntaxRule, bSyntaxRule) &&
        areRuleModesEqual(aSyntaxRule, bSyntaxRule) &&
        areRuleAtEqual(aSyntaxRule, bSyntaxRule)
}