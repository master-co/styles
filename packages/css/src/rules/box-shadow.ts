import { Rule } from '../rule'

export class BoxShadow extends Rule {
    static override id = 'BoxShadow' as const
    static override matches = '^s(?:hadow)?:.'
    static override colorful = true
}