import { Rule } from '../rule'

export class Outline extends Rule {
    static override id = 'Outline' as const
    override order = -1
    static override colorful = true
}