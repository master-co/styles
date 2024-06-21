import Layer from './layer'
import { SyntaxRule } from './syntax-rule'
import MasterCSS, { TypeVariable } from './core'
import { Rule } from './rule'

export default class KeyframeLayer extends Layer {

    readonly usages: Record<string, number> = {}
    
    constructor(
        public css: MasterCSS
    ) {
        super('keyframe', css)
    }

    insert(syntaxRule: SyntaxRule) {
        if (syntaxRule.animationNames) {
            for (const eachAnimationName of syntaxRule.animationNames) {
                if (this.ruleBy[eachAnimationName]) {
                    this.usages[eachAnimationName]++
                } else {
                    super.insert(new Rule(
                        eachAnimationName, 
                        this.css,
                        [{
                            text: `@keyframes ${eachAnimationName}{`
                                + Object
                                    .entries(this.css.animations[eachAnimationName])
                                    .map(([key, variables]) => `${key}{${Object.entries(variables).map(([name, value]) => name + ':' + value).join(';')}}`)
                                    .join('')
                                + '}'
                        }]
                    ))
                    this.usages[eachAnimationName] = 1
                }
            }
        }
    }

    delete(syntaxRule: any) {
        if (syntaxRule.animationNames) {
            for (const eachKeyframeName of syntaxRule.animationNames) {
                if (!--this.usages[eachKeyframeName]) {
                    super.delete(eachKeyframeName)
                }
            }
        }
        return syntaxRule
    }
}