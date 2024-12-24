import MasterCSS from './core'
import Layer from './layer'

export default class AnonymousLayer extends Layer {
    readonly usages: Record<string, number> = {}
    // @ts-expect-error
    native?: CSSStyleSheet

    constructor(
        public css: MasterCSS
    ) {
        super('', css)
        // @ts-expect-error
        this.rules = css.rules
    }

    get text(): string {
        return this.rules.map(({ text }) => text).join('')
    }
}