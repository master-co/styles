import { type CompletionItem, CompletionItemKind } from 'vscode-languageserver-protocol'
import cssDataProvider from './css-data-provider'
import { Layer, MasterCSS, generateCSS, isCoreRule } from '@master/css'
import { getCSSDataDocumentation } from './get-css-data-documentation'
import type { IPropertyData, IValueData } from 'vscode-css-languageservice'
import sortCompletionItems from './sort-completion-items'

export default function getMainCompletionItems(css: MasterCSS = new MasterCSS()): CompletionItem[] {
    const nativeProperties = cssDataProvider.provideProperties()
    const completionItems: CompletionItem[] = []
    const addedKeys = new Set<string>()
    process.env.VSCODE_IPC_HOOK && console.time('getMainCompletionItems')
    for (const EachRule of css.Rules) {
        if (EachRule.definition.layer === Layer.Utility) continue
        const nativeCSSPropertyData = nativeProperties.find(({ name }) => name === EachRule.id)
        const eachCompletionItem = {
            kind: CompletionItemKind.Property,
            documentation: getCSSDataDocumentation(nativeCSSPropertyData, { docs: isCoreRule(EachRule.id) && EachRule.id }),
            detail: nativeCSSPropertyData?.syntax,
            command: {
                title: 'triggerSuggest',
                command: 'editor.action.triggerSuggest'
            }
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

    // todo: test remap utility to native css property
    if (css.config.utilities) {
        for (const utilityName in css.config.utilities) {
            const declarations = css.config.utilities[utilityName]
            const propsLength = Object.keys(declarations).length
            const propName = Object.keys(declarations)[0] as keyof typeof declarations
            const propValue = declarations[propName]
            let nativeCSSData: IPropertyData | IValueData | undefined
            let detail: string | undefined
            /**
             * Remaps to native CSS properties when only one property is declared
             * */
            if (propsLength === 1) {
                const nativeCSSPropertyData = nativeProperties.find(({ name }) => name === propName)
                if (utilityName === propValue) {
                    nativeCSSData = nativeCSSPropertyData?.values?.find(({ name }) =>
                        name === propValue
                        // fix like inline-grid not found
                        || name.replace(/^-(ms|moz)-/, '') === propValue
                    )
                    detail = `${propName}: ${propValue}`
                } else {
                    nativeCSSData = nativeCSSPropertyData
                    detail = nativeCSSPropertyData?.syntax
                }
            }
            completionItems.push({
                label: utilityName,
                kind: CompletionItemKind.Value,
                documentation: getCSSDataDocumentation(nativeCSSData, {
                    generatedCSS: generateCSS([utilityName], css),
                    docs: 'utilities'
                }),
                detail,
            })
        }
    }
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
    process.env.VSCODE_IPC_HOOK && console.timeEnd('getMainCompletionItems')
    return sortCompletionItems(completionItems)
}