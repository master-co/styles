import rules from '../config/rules'

export default function isCoreRule(id: string) {
    return Object.hasOwnProperty.call(rules, id)
}