import Rule from '../rule'

export default class extends Rule {
    static override id = 'GridArea' as const
    static override unit = ''
    override order = -1
}