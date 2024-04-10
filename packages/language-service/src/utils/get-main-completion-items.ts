import { type CompletionItem, CompletionItemKind } from 'vscode-languageserver-protocol'
import { Layer, MasterCSS, generateCSS, isCoreRule } from '@master/css'
import { getCSSDataDocumentation } from './get-css-data-documentation'
import sortCompletionItems from './sort-completion-items'
import getUtilityInfo from './get-utility-info'
import cssDataProvider from './css-data-provider'

export default function getMainCompletionItems(css: MasterCSS = new MasterCSS()): CompletionItem[] {
    const completionItems: CompletionItem[] = []
    const addedKeys = new Set<string>()
    for (const EachRule of css.Rules) {
        if (EachRule.definition.layer === Layer.Utility) {
            const { data, detail, docs } = getUtilityInfo(EachRule, css)
            const utilityName = EachRule.id.slice(1)
            completionItems.push({
                label: utilityName,
                kind: CompletionItemKind.Value,
                documentation: getCSSDataDocumentation(data, {
                    generatedCSS: generateCSS([utilityName], css),
                    docs
                }),
                detail
            })
        } else {
            const nativeProperties = cssDataProvider.provideProperties()
            const nativeCSSPropertyData = nativeProperties.find(({ name }) => name === EachRule.id)
            const eachCompletionItem = {
                kind: CompletionItemKind.Property,
                command: {
                    title: 'triggerSuggest',
                    command: 'editor.action.triggerSuggest'
                },
                documentation: getCSSDataDocumentation(nativeCSSPropertyData, {
                    docs: isCoreRule(EachRule.id) && EachRule.id
                }),
                detail: nativeCSSPropertyData?.syntax,
            }
            EachRule.keys.forEach(key => {
                addedKeys.delete(key)
                completionItems.push({
                    ...eachCompletionItem,
                    label: key + ':',
                    sortText: key
                })
            })
            if (EachRule.definition?.ambiguousKeys?.length) {
                for (const ambiguousKey of EachRule.definition.ambiguousKeys) {
                    if (addedKeys.has(ambiguousKey)) {
                        continue
                    }
                    addedKeys.add(ambiguousKey)
                }
            }
        }
    }
    addedKeys.forEach(ambiguousKey => {
        /**
         * Ambiguous keys are added to the completion list
         * @example text: t:
         */
        completionItems.push({
            kind: CompletionItemKind.Property,
            detail: 'ambiguous key',
            label: ambiguousKey + ':',
            sortText: ambiguousKey,
            command: {
                title: 'triggerSuggest',
                command: 'editor.action.triggerSuggest'
            }
        })
    })
    if (css.config.styles) {
        for (const styleName in css.config.styles) {
            const styleClasses = css.styles[styleName]
            completionItems.push({
                label: styleName,
                kind: CompletionItemKind.Value,
                documentation: getCSSDataDocumentation({} as any, {
                    generatedCSS: generateCSS([styleName], css),
                    docs: 'styles'
                }),
                detail: styleClasses.join(' ') + ' (style)',
            })
        }
    }
    return sortCompletionItems(completionItems)
}