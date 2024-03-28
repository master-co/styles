import { type CompletionItem, CompletionItemKind } from 'vscode-languageserver-protocol'
import cssDataProvider from './css-data-provider'
import { MasterCSS, generateCSS } from '@master/css'
import { getCSSDataDocumentation } from './get-css-data-documentation'

export default function getValueCompletionItems(key: string, css: MasterCSS = new MasterCSS()): CompletionItem[] {
    const nativeProperties = cssDataProvider.provideProperties()
    const completionItems: CompletionItem[] = []
    for (const EachRule of css.Rules) {
        const nativePropertyData = nativeProperties.find((x: { name: string }) => x.name === EachRule.id)
        /**
         * Scoped variables
         */
        if (EachRule.definition.key === key || EachRule.definition.subkey === key) {
            for (const variableName in EachRule.variables) {
                if (variableName.startsWith('-')) continue
                const variable = EachRule.variables[variableName]
                completionItems.push({
                    label: variableName,
                    kind: CompletionItemKind.Variable,
                    detail: '(variable) ' + variable.value
                })
            }
        }
        /**
         * Ambiguous values
         * @example text: -> center, left, right, justify
         * @example t: -> center, left, right, justify
         */
        if (EachRule.definition.ambiguousKeys?.includes(key) && EachRule.definition.ambiguousValues?.length) {
            for (const ambiguousValue of EachRule.definition.ambiguousValues) {
                if (typeof ambiguousValue !== 'string') continue
                const nativeValueData = nativePropertyData?.values?.find((x: { name: string }) => x.name === ambiguousValue)
                completionItems.push({
                    label: ambiguousValue,
                    kind: CompletionItemKind.Value,
                    sortText: ambiguousValue,
                    documentation: getCSSDataDocumentation(nativeValueData, {
                        generatedCSS: generateCSS([key + ':' + ambiguousValue], css)
                    }),
                    detail: EachRule.id + ': ' + ambiguousValue
                })
            }
        }
    }
    /**
     * Native values
     */
    nativeProperties.find((x: { name: string }) => x.name === key)?.values?.forEach(value => {
        if (completionItems.find(x => x.label === value.name)) return
        completionItems.push({
            label: value.name,
            kind: CompletionItemKind.Value,
            sortText: value.name.startsWith('-')
                ? 'zz' + value.name.slice(1)
                : value.name,
            documentation: getCSSDataDocumentation(value, {
                generatedCSS: generateCSS([key + ':' + value.name], css)
            }),
            detail: key + ': ' + value.name
        })
    })

    return completionItems
}