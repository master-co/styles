import type { Rule } from '../rule'
import areRuleSelectorsEqual from './are-rule-selectors-equal'
import areRuleModesEqual from './are-rule-modes-equal'
import areRuleAtEqual from './are-rule-at-equal'

export default function areRuleStatesEqual(aRule: Rule, bRule: Rule) {
    return areRuleSelectorsEqual(aRule, bRule) &&
        areRuleModesEqual(aRule, bRule) &&
        areRuleAtEqual(aRule, bRule)
}