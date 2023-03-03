import { Rule } from '../rule'

export default class extends Rule {
    static override id = 'GridTemplateColumns' as const
    static override matches = '^grid-template-cols:.'
}