import { Rule } from './rule'
import MasterCSS from './core'
import findNativeCSSRuleIndex from 'shared/utils/find-native-css-rule-index'

export default class Layer {
    readonly rules: (Rule | Layer)[] = []
    readonly usages: Record<string, number> = {}
    native?: CSSLayerBlockRule

    constructor(
        public name: string,
        public css: MasterCSS
    ) {
        if (!this.name) {
            // @ts-expect-error readonly
            this.rules = css.rules
        }
    }

    insert(rule: Rule, index = this.rules.length) {
        if (this.rules.includes(rule)) return

        if (this.name && !this.css.rules.includes(this)) {
            this.css.rules.push(this)
            const nativeSheet = this.css.style?.sheet
            if (nativeSheet && !this.native) {
                const insertedIndex = nativeSheet.insertRule(this.text)
                this.native = nativeSheet.cssRules.item(insertedIndex) as CSSLayerBlockRule
            }
        }

        if (this.native) {
            let cssRuleIndex = 0
            const lastCssRule = (function getLastCssRule(layer: Layer, index: number) {
                let lastCssRule: any
                const previouRule = layer.rules[index]
                if (previouRule) {
                    if ('nodes' in previouRule) {
                        if (!previouRule.nodes.length)
                            return getLastCssRule(layer, index - 1)

                        const lastNativeRule = previouRule.nodes[previouRule.nodes.length - 1]
                        lastCssRule = lastNativeRule.native
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

            for (let i = 0; i < rule.nodes.length;) {
                try {
                    const nativeRule = rule.nodes[i]
                    this.native.insertRule(nativeRule.text, cssRuleIndex)
                    nativeRule.native = this.native.cssRules[cssRuleIndex++]
                    i++
                } catch (error) {
                    console.error(error)
                    rule.nodes.splice(i, 1)
                }
            }
        }

        this.rules.splice(index as number, 0, rule)
    }

    delete(key: string) {
        const rule = this.rules.find((rule) => (rule as Rule).key === key)
        if (!rule) return
        if (this.name && this.rules.length === 1) {
            const indexOfLayer = this.css.rules.indexOf(this)
            this.css.rules.splice(indexOfLayer, 1)
            const nativeSheet = this.css.style?.sheet
            if (nativeSheet && this.native) {
                const foundIndex = findNativeCSSRuleIndex(nativeSheet.cssRules, this.native)
                if (foundIndex !== -1) {
                    nativeSheet.deleteRule(foundIndex)
                    this.native = undefined
                }
            }
        }

        if (this.native) {
            if ('nodes' in rule) {
                const firstNativeRule = rule.nodes[0]
                const foundIndex = findNativeCSSRuleIndex(this.native.cssRules, firstNativeRule.native!)
                if (foundIndex !== -1) {
                    for (let j = 0; j < rule.nodes.length; j++) {
                        this.native.deleteRule(foundIndex)
                    }
                }
            } else if (rule.native) {
                const foundIndex = findNativeCSSRuleIndex(this.native.cssRules, rule.native)
                if (foundIndex !== -1) {
                    this.native.deleteRule(foundIndex)
                }
            }
        }

        this.rules.splice(this.rules.indexOf(rule), 1)
        return rule
    }

    reset() {
        this.rules.forEach((rule) => this.delete((rule as Rule).key))
        // @ts-expect-error
        this.usages = {}
        if (this.native) {
            this.native = undefined
        }
    }

    get text(): string {
        return '@layer ' + this.name + '{' + this.rules.map(({ text }) => text).join('') + '}'
    }
}