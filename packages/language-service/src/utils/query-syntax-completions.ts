import { CompletionItemKind, type CompletionItem } from 'vscode-languageserver-protocol'
import getPseudoClassCompletionItems from './get-pseudo-class-completion-items'
import getPseudoElementCompletionItems from './get-pseudo-element-completion-items'
import { ANIMATION_SIGN, AT_SIGN, MasterCSS, QUERY_COMPARISON_OPERATORS, QUERY_LOGICAL_OPERATORS, TRANSITION_SIGN, generateCSS } from '@master/css'
import { SELECTOR_TRIGGER_CHARACTERS } from '../common'
import getMainCompletionItems from './get-main-completion-items'
import { SELECTOR_SIGNS } from '@master/css'
import getValueCompletionItems from './get-value-completion-items'
import getQueryCompletionItems from './get-query-completion-items'
import { getCSSDataDocumentation } from './get-css-data-documentation'

export default function querySyntaxCompletions(q = '', css: MasterCSS = new MasterCSS()) {
    const fields = q.split(' ')
    const field = fields[fields.length - 1]
    const triggerCharacter = q.charAt(q.length - 1)
    const invoked = triggerCharacter === ' ' || field.length === 0
    if (invoked || field === '{' || triggerCharacter === ';') {
        return getMainCompletionItems(css)
    }
    const match = field.match(/^[^'":\s]+:/)
    const atMatch = field.match(/@(?=(?:[^'"]|'[^']*'|"[^"]*")*$)/)
    const firstAtIndex = atMatch ? atMatch[0].length - 1 : -1
    const firstColonIndex = match ? match[0].length - 1 : -1
    const selectorInvokedRegex = new RegExp(`[${SELECTOR_SIGNS.join('')}](?=(?:[^'"]|'[^']*'|"[^"]*")*$)`)
    const atInvoked = firstAtIndex !== -1
    const key = match ? match[0].slice(0, firstColonIndex) : undefined
    const styleNames = Object.keys(css.config.styles || {})
    const utilityNames = Object.keys(css.config.utilities || {})
    const isStyle = !!styleNames.find((eachStyleName) => new RegExp(`^${eachStyleName}(?:\\b|_)`).test(field))
    const isUtility = !!utilityNames.find((eachUtilityName) => new RegExp(`^${eachUtilityName}(?:\\b|_)`).test(field))

    // check by utilities and styles
    if (!isStyle && !isUtility) {
        if (key === undefined) {
            /**
             * The server capability sets '@' '~' as the trigger characters for at and adjacent selectors,
             * but these two characters are also the prefix symbols of `animation` and `transition`,
             * and should be filtered to prevent hints all completions items.
             * @example class="@"
             * @example class="~"
             */
            if (field.startsWith(ANIMATION_SIGN) || field.startsWith(TRANSITION_SIGN)) {
                return getMainCompletionItems(css)
                    .filter(completionItem => completionItem.label.startsWith(field))
                    .map((completionItem) => ({ ...completionItem, label: completionItem.label.slice(1) }))
            }
            return getMainCompletionItems(css)
        }
        if (!atInvoked && firstColonIndex !== -1 && !selectorInvokedRegex.test(field.slice(firstColonIndex + 1))) {
            return getValueCompletionItems(css, key)
        }
    }

    /**
     * Not support conditional btn:hover
     */
    if (isStyle) return

    if (atInvoked && [AT_SIGN, ...QUERY_COMPARISON_OPERATORS, ...QUERY_LOGICAL_OPERATORS].includes(triggerCharacter)) {
        return getQueryCompletionItems(css, triggerCharacter, field)
    }

    if (!atInvoked && SELECTOR_TRIGGER_CHARACTERS.includes(triggerCharacter)) {
        const pseudoElementCompletionItems = getPseudoElementCompletionItems(css, field)
        if (field.endsWith('::')) {
            /**
             * Consider trigger characters and fix insertText.
             * @incorrect class="text:center::" -> class="text:center::::after"
             * @correct class="text:center::" -> class="text:center::after"
             */
            pseudoElementCompletionItems.forEach((completionItem) => completionItem.insertText = completionItem.label.slice(2))
            return pseudoElementCompletionItems
        } else {
            const completionItems: CompletionItem[] = getPseudoClassCompletionItems(css, field)
            completionItems.push(...pseudoElementCompletionItems)
            /**
             * Consider trigger characters and fix insertText.
             * @incorrect class="text:center:" -> class="text:center::active"
             * @correct class="text:center:" -> class="text:center:active"
             */
            if (triggerCharacter === ':') {
                completionItems.forEach((completionItem) => completionItem.insertText = completionItem.label.slice(1))
            } else {
                completionItems.push({
                    label: '.<class>',
                    insertText: '.',
                    documentation: getCSSDataDocumentation(undefined, {
                        generatedCSS: generateCSS([field + '.class'], css),
                        docs: 'selectors'
                    }),
                    kind: CompletionItemKind.Class
                })
            }
            return completionItems
        }

    }
}