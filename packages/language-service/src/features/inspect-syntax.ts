import type { Hover, HoverParams, Range } from 'vscode-languageserver'
import { Layer } from '@master/css'
import { getCssEntryMarkdownDescription } from '../utils/get-css-entry-markdown-description'
// @ts-expect-error
import { css_beautify } from 'js-beautify/js/lib/beautify-css'
import type CSSLanguageService from '../core'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import cssDataProvider from '../utils/css-data-provider'

export default function inspectSyntax(this: CSSLanguageService, document: TextDocument, position: HoverParams['position']): Hover | undefined {
    const checkResult = this.getClassPosition(document, position)
    if (!checkResult) return
    const syntax = checkResult.token
    const range: Range = {
        start: document.positionAt(checkResult.range.start),
        end: document.positionAt(checkResult.range.end)
    }
    const rules = this.css.generate(syntax)
    const css = new MasterCSS(this.settings?.config)
    css.add(syntax)
    const rule = rules[0]
    const contents = []
    if (rule) {
        /* preview the generated css */
        contents.push({
            language: 'css',
            value: css_beautify(css.text, {
                newline_between_rules: false,
                indent_size: 2
            })
        })
        /* reference and info about the syntax */
        const cssProperties = cssDataProvider.provideProperties()
        let cssHoverInfo: any = null
        const fullKey = rule.id
        const originalCssProperty = cssProperties.find((x: { name: string }) => x.name == fullKey)
        if (rule.layer && [Layer.Core, Layer.CoreNative, Layer.CoreShorthand, Layer.CoreNativeShorthand].includes(rule.layer) && originalCssProperty) {
            if (!originalCssProperty.references?.find((x: { name: string }) => x.name === 'Master CSS')) {
                originalCssProperty.references = [
                    {
                        name: 'Master CSS',
                        url: `https://rc.css.master.co/docs/${fullKey}`
                    },
                    ...(originalCssProperty?.references ?? []),
                ]
            }
            cssHoverInfo = getCssEntryMarkdownDescription(originalCssProperty)
        }
        if (cssHoverInfo) {
            contents.push(cssHoverInfo)
        }
        return { contents, range }
    }
}
