import { Config } from '@master/css'
import RuntimeCSS from '../src'
import { beforeAll } from 'vitest'

declare type PrerenderingCSSContext = {
    runtimeCSS: RuntimeCSS
    sheet: CSSStyleSheet
    preRenderedTexts: string[]
}

export function withRuntimeCSS(preRenderedTexts: string[], config: Config | undefined, cb: (context: PrerenderingCSSContext) => void) {
    const context: any = {
        runtimeCSS: new RuntimeCSS(document, config),
        preRenderedTexts
    }
    beforeAll(() => {
        const style = document.createElement('style')
        style.id = 'master'
        style.textContent = preRenderedTexts.join('')
        document.head.appendChild(style)
        context.sheet = style.sheet as CSSStyleSheet
        if (!context.sheet) throw new Error('sheet is null')
        runtimeCSS.style = style
        runtimeCSS.observe()
    })
    cb(context as PrerenderingCSSContext)
}