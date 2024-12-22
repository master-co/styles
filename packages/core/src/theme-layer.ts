import Layer from './layer'
import { SyntaxRule } from './syntax-rule'
import MasterCSS, { TypeVariable } from './core'
import { Rule } from './rule'

export default class ThemeLayer extends Layer {
    readonly usages: Record<string, number> = {}
    constructor(
        public css: MasterCSS
    ) {
        super('theme', css)
    }
    insert(syntaxRule: SyntaxRule) {
        if (syntaxRule.variableNames) {
            for (const eachVariableName of syntaxRule.variableNames) {
                const variable = this.css.variables[eachVariableName]
                if (this.ruleBy[eachVariableName]) {
                    this.usages[eachVariableName]++
                } else {
                    const newRule = new Rule(eachVariableName, this.css)
                    const addNative = (mode: string, _variable: TypeVariable) => {
                        let isDefaultMode = false
                        let preifxCssRuleText: string
                        let endCurlyBracketCount = 1
                        if (mode) {
                            switch (this.css.config.modes?.[mode]) {
                                case 'media':
                                    preifxCssRuleText =  `@media(prefers-color-scheme:${mode}){:root`
                                    endCurlyBracketCount++
                                    break
                                case 'host':
                                    preifxCssRuleText = `:host(.${mode})`
                                    if (!variable.value && this.css.config.defaultMode === mode) {
                                        preifxCssRuleText += ',:host'
                                        isDefaultMode = true
                                    }
                                    break
                                case 'class':
                                    preifxCssRuleText = `.${mode}`
                                    if (!variable.value && this.css.config.defaultMode === mode) {
                                        preifxCssRuleText += ',:root'
                                        isDefaultMode = true
                                    }
                                    break
                                default:
                                    return
                            }
                        } else {
                            preifxCssRuleText = ':root'
                        }

                        const cssRuleText = `${preifxCssRuleText}{--${eachVariableName}:${String(_variable.value)}${'}'.repeat(endCurlyBracketCount)}`
                        if (isDefaultMode) {
                            newRule.natives.unshift({
                                text: cssRuleText
                            })
                        } else {
                            newRule.natives.push({
                                text: cssRuleText
                            })
                        }
                    }
                    if (variable.value) {
                        addNative('', variable as any)
                    }
                    if (variable.modes) {
                        for (const mode in variable.modes) {
                            addNative(mode, variable.modes[mode])
                        }
                    }
                    super.insert(newRule)
                    this.usages[eachVariableName] = 1
                }
            }
        }
    }

    delete(syntaxRule: any) {
        if (syntaxRule.variableNames) {
            for (const eachVariableName of syntaxRule.variableNames) {
                if (!--this.usages[eachVariableName]) {
                    super.delete(eachVariableName)
                    delete this.usages[eachVariableName]
                }
            }
        }
        return syntaxRule
    }
}