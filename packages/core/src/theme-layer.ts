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
                        let cssRuleText: string
                        let endCurlyBracketCount = 1
                        if (mode) {
                            switch (this.css.config.modes?.[mode]) {
                                case 'media':
                                    cssRuleText =  `@media(prefers-color-scheme:${mode}){:root`
                                    endCurlyBracketCount++
                                    break
                                case 'host':
                                    cssRuleText = `:host(.${mode})`
                                    if (!variable.value && this.css.config.defaultMode === mode) {
                                        cssRuleText += ',:host'
                                    }
                                    break
                                case 'class':
                                    cssRuleText = `.${mode}`
                                    if (!variable.value && this.css.config.defaultMode === mode) {
                                        cssRuleText += ',:root'
                                    }
                                    break
                                default:
                                    return
                            }
                        } else {
                            cssRuleText = ':root'
                        }
                        newRule.natives.push({
                            text: `${cssRuleText}{--${eachVariableName}:${String(_variable.value)}${'}'.repeat(endCurlyBracketCount)}`
                        })
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