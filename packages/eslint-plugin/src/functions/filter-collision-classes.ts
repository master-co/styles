import { generateValidRules } from '@master/css-validator'
import { MasterCSS, Rule, areRuleStatesEqual, areRulesDuplicated } from '@master/css'

export default function filterCollisionClasses(classNames: string[], css: MasterCSS): Record<string, string[]> {
    const validRules = classNames
        .map(eachClassName => generateValidRules(eachClassName, css)[0])
        .filter(Boolean) as Rule[]
    const collisionClassesRecord: Record<string, string[]> = {}
    for (let i = 0; i < classNames.length; i++) {
        const className = classNames[i]
        const rule = validRules.find((eachValidRule) => eachValidRule.name === className)
        const collisionClasses = []
        if (rule) {
            for (let j = 0; j < classNames.length; j++) {
                const compareClassName = classNames[j]
                const compareRule = validRules.find((eachValidRule) => eachValidRule.name === compareClassName)
                if (i !== j && compareRule
                    && areRulesDuplicated(rule as any, compareRule as any)
                    && areRuleStatesEqual(rule as any, compareRule as any)
                ) {
                    collisionClasses.push(compareClassName)
                }
            }
            if (collisionClasses.length > 0) {
                collisionClassesRecord[className] = collisionClasses
            }
        }
    }
    return collisionClassesRecord
}