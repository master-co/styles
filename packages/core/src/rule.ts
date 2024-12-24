import MasterCSS from './core'

export class Rule {
    constructor(
        public readonly name: string,
        public css: MasterCSS,
        public natives: NativeRule[] = []
    ) { }

    get key(): string {
        return this.name
    }

    get text(): string {
        return this.natives.map(({ text }) => text).join('')
    }
}

export interface NativeRule {
    text: string
    cssRule?: CSSRule
}
