import { MasterCSS, generateCSS } from '@master/css'
import cssDataProvider from './css-data-provider'
import { type CompletionItem, CompletionItemKind } from 'vscode-languageserver-protocol'
import sortCompletionItems from './sort-completion-items'
import { IPseudoClassData } from 'vscode-css-languageservice'
import { getCSSDataDocumentation } from './get-css-data-documentation'

const kind = CompletionItemKind.Function

export default function getPseudoClassCompletionItems(css: MasterCSS = new MasterCSS(), syntax: string): CompletionItem[] {
    const pseudoClassDataList = cssDataProvider.providePseudoClasses()
        .filter((data) => {
            // exclude @page pseudo-classes
            if ([':first', ':left', ':right', ':blank'].includes(data.name)) return false
            return true
        })
    const completionItems = pseudoClassDataList
        .map((data) => {
            // fix https://github.com/microsoft/vscode-custom-data/issues/78
            const name = /:(?:dir|has|is|nth-col|where)/.test(data.name) ? data.name + '()' : data.name
            let sortText = name.startsWith(':-')
                ? 'yyyy' + name.slice(2)
                : 'yy' + name.replace(/^:/, '')
            if (sortText.endsWith('()')) sortText = 'y' + sortText
            return {
                label: name,
                sortText,
                documentation: getCSSDataDocumentation(data, {
                    generatedCSS: generateCSS([syntax + name.slice(1)], css),
                    docs: '/guide/syntax#selectors'
                }),
                kind,
                data
            } as CompletionItem
        })

    for (const selectorName in css.config.selectors) {
        if (selectorName.startsWith('::')) continue
        const selectorValue = css.config.selectors[selectorName]
        const name = selectorName.endsWith('(') ? selectorName + ')' : selectorName
        const value = typeof selectorValue === 'string'
            ? selectorValue.endsWith('(') ? selectorValue + ')' : selectorValue
            : selectorValue
        const data: IPseudoClassData | undefined = pseudoClassDataList.find((data) =>
            typeof value === 'string' ? value.startsWith(data.name) : false)
        let sortText = name.startsWith(':-')
            ? 'yyyy' + name.slice(2)
            : 'yy' + name.replace(/^:/, '')
        if (sortText.endsWith('()')) sortText = 'y' + sortText
        const completionItem: CompletionItem = {
            label: name,
            documentation: getCSSDataDocumentation(data, {
                generatedCSS: generateCSS([syntax + name.slice(1)], css),
                docs: '/guide/syntax#selectors'
            }),
            sortText,
            kind,
            detail: String(value),
            data
        }
        completionItems.push(completionItem)
    }

    return sortCompletionItems(completionItems)
}