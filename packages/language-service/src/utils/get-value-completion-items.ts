import { type CompletionItem, CompletionItemKind } from 'vscode-languageserver-protocol'
import cssDataProvider from './css-data-provider'
import { Layer, MasterCSS, generateCSS, isCoreRule } from '@master/css'
import { getCSSDataDocumentation } from './get-css-data-documentation'
import sortCompletionItems from './sort-completion-items'
import type { IValueData } from 'vscode-css-languageservice'

export default function getValueCompletionItems(key: string, css: MasterCSS = new MasterCSS()): CompletionItem[] {
    const nativeProperties = cssDataProvider.provideProperties()
    const completionItems: CompletionItem[] = []
    for (const EachRule of css.Rules) {
        /**
         * Scoped variables
         */
        if (EachRule.definition.key === key || EachRule.definition.subkey === key) {
            for (const variableName in EachRule.variables) {
                if (variableName.startsWith('-')) continue
                const variable = EachRule.variables[variableName]
                const nativePropertyData = nativeProperties.find((x: { name: string }) => x.name === variable.group)
                completionItems.push({
                    label: variableName,
                    sortText: '0' + variableName,
                    kind: CompletionItemKind.Variable,
                    documentation: getCSSDataDocumentation(nativePropertyData, {
                        generatedCSS: generateCSS([key + ':' + variable.key], css),
                        docs: isCoreRule(variable.group || '') && variable.group
                    }),
                    detail: `${variable.group} ${variable.value}`
                })
            }
        }
        /**
         * Ambiguous values
         * @example text: -> center, left, right, justify
         * @example t: -> center, left, right, justify
         */
        if (EachRule.definition.ambiguousKeys?.includes(key) && EachRule.definition.ambiguousValues?.length) {
            const nativePropertyData = nativeProperties.find((x: { name: string }) => x.name === EachRule.id)
            for (const ambiguousValue of EachRule.definition.ambiguousValues) {
                if (typeof ambiguousValue !== 'string') continue
                const nativeValueData = nativePropertyData?.values?.find((x: { name: string }) => x.name === ambiguousValue)
                const isNative = EachRule.definition.layer && [Layer.Native, Layer.NativeShorthand].includes(EachRule.definition.layer)
                completionItems.push({
                    label: ambiguousValue,
                    kind: CompletionItemKind.Value,
                    sortText: ambiguousValue,
                    documentation: getCSSDataDocumentation({
                        ...(nativeValueData || {} as IValueData),
                        // use nativePropertyData.reference because nativeValueData does not have references
                        references: nativePropertyData?.references
                    }, {
                        generatedCSS: generateCSS([key + ':' + ambiguousValue], css),
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
    const nativePropertyData = nativeProperties.find((x: { name: string }) => x.name === key)
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
                sortText: value.name.startsWith('-')
                    ? 'zz' + value.name.slice(1)
                    : value.name,
                documentation: getCSSDataDocumentation({
                    ...value,
                    // use nativePropertyData.reference because nativeValueData does not have references
                    references: nativePropertyData?.references
                }, {
                    generatedCSS: generateCSS([key + ':' + value.name], css),
                    docs: key
                }),
                detail: key + ': ' + value.name
            })
        })

    return sortCompletionItems(completionItems)
}