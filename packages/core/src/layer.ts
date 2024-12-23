import { Rule } from './rule'
import MasterCSS from './core'

export default class Layer {
    readonly ruleBy: Record<string, Rule> = {}
    native?: CSSLayerBlockRule | CSSStyleSheet
    readonly rules: (Rule | Layer)[] = []
    readonly usages: Record<string, number> = {}

    constructor(
        public name: string,
        public css: MasterCSS
    ) {
        if (!this.name) {
            // @ts-expect-error readonly
            this.rules = css.rules
        }
    }

    insert(rule: Rule, index?: number) {
        const name = this.getName(rule.name, rule.fixedClass)
        if (this.ruleBy[name])
            return

        if (this.name && !this.css.rules.includes(this)) {
            this.css.rules.push(this)
            const nativeSheet = this.css.style?.sheet
            if (nativeSheet && !this.native) {
                const lengthOfRules = this.css.rules.length
                nativeSheet.insertRule(this.text, lengthOfRules - 1)
                this.native = nativeSheet.cssRules.item(lengthOfRules - 1) as CSSLayerBlockRule
            }
        }

        if (index === undefined) {
            index = this.rules.length
        }

        if (this.native) {
            let cssRuleIndex = 0
            const lastCssRule = (function getLastCssRule(layer: Layer, index: number) {
                let lastCssRule: any
                const previouRule = layer.rules[index]
                if (previouRule) {
                    if ('natives' in previouRule) {
                        if (!previouRule.natives.length)
                            return getLastCssRule(layer, index - 1)

                        const lastNativeRule = previouRule.natives[previouRule.natives.length - 1]
                        lastCssRule = lastNativeRule.cssRule
                    } else {
                        if (previouRule.name) {
                            lastCssRule = previouRule.native
                        } else {
                            lastCssRule = getLastCssRule(previouRule, previouRule.rules.length - 1)
                            if (!lastCssRule)
                                return getLastCssRule(layer, index - 1)
                        }
                    }
                }
                return lastCssRule
            })(this, index as number - 1)
            if (lastCssRule) {
                for (let i = 0; i < this.native.cssRules.length; i++) {
                    if (this.native.cssRules[i] === lastCssRule) {
                        cssRuleIndex = i + 1
                        break
                    }
                }
            }

            for (let i = 0; i < rule.natives.length;) {
                try {
                    const nativeRule = rule.natives[i]
                    this.native.insertRule(nativeRule.text, cssRuleIndex)
                    nativeRule.cssRule = this.native.cssRules[cssRuleIndex++]
                    i++
                } catch (error) {
                    console.error(error)
                    rule.natives.splice(i, 1)
                }
            }
        }

        this.rules.splice(index as number, 0, rule)
        this.ruleBy[name] = rule
    }

    delete(className: string, fixedClass?: string): Rule {
        const name = this.getName(className, fixedClass)
        const rule = this.ruleBy[name]
        if (!rule) return rule

        if (this.name && this.rules.length === 1) {
            const indexOfLayer = this.css.rules.indexOf(this)
            this.css.rules.splice(indexOfLayer, 1)
            const nativeSheet = this.css.style?.sheet
            if (nativeSheet && this.native) {
                nativeSheet.deleteRule(indexOfLayer)
                this.native = undefined
            }
        }

        if (this.native) {
            if (rule.natives.length) {
                const firstNativeRule = rule.natives[0]
                for (let i = 0; i < this.native.cssRules.length; i++) {
                    const eachCSSRule = this.native.cssRules[i]
                    if (eachCSSRule === firstNativeRule.cssRule) {
                        // eslint-disable-next-line @typescript-eslint/prefer-for-of
                        for (let j = 0; j < rule.natives.length; j++) {
                            this.native.deleteRule(i)
                        }
                        break
                    }
                }
            }
        }

        delete this.ruleBy[name]
        this.rules.splice(this.rules.indexOf(rule), 1)
        return rule
    }

    getName(className: string, fixedClass?: string) {
        return (fixedClass ? fixedClass + ' ' : '') + className
    }

    reset() {
        // @ts-expect-error
        this.ruleBy = {}
        // @ts-expect-error
        this.usages = {}
        if (this.name) {
            // @ts-expect-error readonly
            this.rules = []
        }
        if (this.native) {
            this.native = undefined
        }
    }

    get text(): string {
        return this.name
            ? '@layer ' + this.name + '{' + this.rules.map((eachRule) => (eachRule as Rule).text).join('') + '}'
            : this.rules.map((eachRule) => (eachRule as Rule).text).join('')
    }
}