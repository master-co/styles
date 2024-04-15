import { type CompletionItem, CompletionItemKind } from 'vscode-languageserver-protocol'
import cssDataProvider from './css-data-provider'
import { Layer, MasterCSS, Variable, generateCSS, isCoreRule } from '@master/css'
import { getCSSDataDocumentation } from './get-css-data-documentation'
import sortCompletionItems from './sort-completion-items'
import type { IValueData } from 'vscode-css-languageservice'

const SCOPED_VARIABLE_PRIORITY = 'aaaa'
const AMBIGUOUS_PRIORITY = 'bbbb'
const NATIVE_PRIORITY = 'ccccc'
const GLOBAL_VARIABLE_PRIORITY = 'zzzz'

export default function getValueCompletionItems(css: MasterCSS = new MasterCSS(), ruleKey: string): CompletionItem[] {
    const nativeProperties = cssDataProvider.provideProperties()
    const completionItems: CompletionItem[] = []
    const nativeKey = css.Rules.find(({ keys }) => keys.includes(ruleKey))?.id
    const nativePropertyData = nativeProperties.find(({ name }) => name === nativeKey)
    const generateVariableCompletionItem = (variable: Variable, { scoped } = { scoped: false }): CompletionItem | undefined => {
        const eachNativePropertyData = nativeProperties.find((x: { name: string }) => x.name === variable.group) || nativePropertyData
        const appliedValue = scoped ? variable.key : variable.name
        const documentation = getCSSDataDocumentation(eachNativePropertyData, {
            generatedCSS: generateCSS([ruleKey + ':' + appliedValue], css),
            docs: eachNativePropertyData?.name || 'variables'
        })
        if (variable.type === 'color') {
            if (Object.keys(variable.modes || {}).length) {
                return {
                    kind: CompletionItemKind.Color,
                    label: variable.name,
                    documentation,
                    detail: `${variable.name}`
                }
            } else {
                // todo: packages/css should support getTextByVariable(variable)
                const configKey = 'variables.' + (variable.group ? variable.group + '.' + variable.key : variable.name)
                const valueToken = ((variable.space && variable.value)
                    // vscode doesn't support rgba(0 0 0/.5) in detail
                    ? `${variable.space}(${variable.value.split(' ').join(',')})`
                    : variable.value)
                return {
                    label: variable.name,
                    // detail is shown in the detail pane
                    // todo: variable.token should be recorded as original config variable
                    detail: String(configKey),
                    // documentation is shown in the hover
                    // todo: should convert and space to rgba
                    documentation: {
                        kind: 'markdown',
                        value: valueToken + '\n\n' + documentation?.value
                    },
                    kind: CompletionItemKind.Color,
                    sortText: 'color-' + (variable.name.replace(/(.+?)-(\d+)/, (match, prefix, num) =>
                        prefix + ('00000' + num).slice(-5))),
                }
            }
        } else if (variable.type === 'number') {
            if (variable.value < 0) return
            return {
                kind: CompletionItemKind.Value,
                label: variable.name,
                documentation,
                detail: String(variable.value)
            }
        } else {
            return {
                kind: CompletionItemKind.Value,
                label: variable.name,
                documentation,
                detail: String(variable.value || variable.name)
            }
        }
    }

    for (const EachRule of css.Rules) {
        /**
         * Scoped variables
         * @example box: + content -> box-sizing:content
         */
        if (EachRule.definition.key === ruleKey || EachRule.definition.subkey === ruleKey || EachRule.definition.ambiguousKeys?.includes(ruleKey)) {
            for (const variableName in EachRule.variables) {
                if (completionItems.find(({ label }) => label === variableName)) continue
                const variable = EachRule.variables[variableName]
                const completionItem = generateVariableCompletionItem(variable, { scoped: true })
                if (completionItem) {
                    completionItem.label = variableName
                    completionItem.sortText = SCOPED_VARIABLE_PRIORITY + variableName
                    completionItem.detail = '(scope) ' + completionItem.detail
                    completionItems.push(completionItem)
                }
            }

            /**
             * @example animation:fade
             */
            if (EachRule.definition?.sign && EachRule.definition.includeAnimations) {
                for (const animationName in css.animations) {
                    const isNative = EachRule.definition.layer && [Layer.Native, Layer.NativeShorthand].includes(EachRule.definition.layer)
                    completionItems.push({
                        label: animationName + '|1s',
                        kind: CompletionItemKind.Value,
                        documentation: getCSSDataDocumentation(undefined, {
                            generatedCSS: generateCSS([ruleKey + ':' + animationName + '|1s'], css),
                            docs: isCoreRule(EachRule.id) && EachRule.id
                        }),
                        detail: isNative ? EachRule.id + ': ' + animationName + '|1s' : animationName + '|1s'
                    })
                }
            }
        }
        /**
         * Ambiguous values
         * @example text: -> center, left, right, justify
         * @example t: -> center, left, right, justify
         */
        if (EachRule.definition.ambiguousKeys?.includes(ruleKey) && EachRule.definition.ambiguousValues?.length) {
            const nativePropertyData = nativeProperties.find((x: { name: string }) => x.name === EachRule.id)
            for (const ambiguousValue of EachRule.definition.ambiguousValues) {
                if (typeof ambiguousValue !== 'string') continue
                const nativeValueData = nativePropertyData?.values?.find((x: { name: string }) => x.name === ambiguousValue)
                const isNative = EachRule.definition.layer && [Layer.Native, Layer.NativeShorthand].includes(EachRule.definition.layer)
                completionItems.push({
                    label: ambiguousValue,
                    kind: CompletionItemKind.Value,
                    sortText: AMBIGUOUS_PRIORITY + ambiguousValue,
                    documentation: getCSSDataDocumentation({
                        ...(nativeValueData || {} as IValueData),
                        // use nativePropertyData.reference because nativeValueData does not have references
                        references: nativePropertyData?.references
                    }, {
                        generatedCSS: generateCSS([ruleKey + ':' + ambiguousValue], css),
                        docs: isCoreRule(EachRule.id) && EachRule.id
                    }),
                    detail: isNative ? EachRule.id + ': ' + ambiguousValue : ambiguousValue
                })
            }
        }
    }

    /**
     * Native values
     */
    if (nativeKey) {
        nativePropertyData?.values
            ?.forEach(value => {
                if (completionItems.find(x => x.label === value.name)
                    // should ignore 100, 200 ... 900
                    || nativePropertyData.name === 'font' && typeof +value.name === 'number'
                    // should ignore values ​​containing blanks
                    || value.name.includes(' ')
                ) return
                completionItems.push({
                    label: value.name,
                    kind: CompletionItemKind.Value,
                    sortText: NATIVE_PRIORITY + (value.name.startsWith('-')
                        ? 'zz' + value.name.slice(1)
                        : value.name),
                    documentation: getCSSDataDocumentation({
                        ...value,
                        // use nativePropertyData.reference because nativeValueData does not have references
                        references: nativePropertyData?.references
                    }, {
                        generatedCSS: generateCSS([ruleKey + ':' + value.name], css),
                        docs: nativeKey
                    }),
                    detail: nativeKey + ': ' + value.name
                })
            })
    }

    // global variables
    for (const variableName in css.variables) {
        if (variableName.startsWith('-')) continue
        const conflicted = completionItems.find(({ label }) => label === variableName)
        const variable = css.variables[variableName]
        if (conflicted) {
            variable.name = `$(${variableName})`
        }
        const completionItem = generateVariableCompletionItem(variable)
        if (completionItem) {
            completionItem.label = variable.name
            completionItem.sortText = GLOBAL_VARIABLE_PRIORITY + completionItem.sortText
            completionItem.detail = '(global) ' + completionItem.detail
            completionItems.push(completionItem)
        }
    }

    return sortCompletionItems(completionItems)
}