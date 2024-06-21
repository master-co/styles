import MasterCSS from './core'

export class Rule {
    constructor(
        public readonly name: string,
        public css: MasterCSS,
        public natives: NativeRule[] = [],
        public fixedClass?: string
    ) {}
    
    get text(): string {
        return this.natives.map((eachNative) => eachNative.text).join('')
    }
}

export interface NativeRule {
    text: string
    cssRule?: CSSRule
}
