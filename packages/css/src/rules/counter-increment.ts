import Rule from '../rule'

export default class extends Rule {
    static override id = 'CounterIncrement' as const
    static override unit = ''
}