import MasterCSS from './core'

export class Rule {
    constructor(
        public readonly name: string,
        public css: MasterCSS,
        public natives: NativeRule[] = [],
        public fixedClass?: string
    ) { }

    get key(): string {
        return (this.fixedClass ? this.fixedClass + ' ' : '') + this.name
    }

    get text(): string {
        return this.natives.map((eachNative) => eachNative.text).join('')
    }
}

export interface NativeRule {
    text: string
    cssRule?: CSSRule
}
