import CSSLanguageService from '../../src/core'
import createDoc from '../../src/utils/create-doc'
import { Settings } from '../../src/settings'

export const hint = (target: string, { quotes = true, settings }: { quotes?: boolean, settings?: Settings } = {}) => {
    const contents = [`<div class=${quotes ? '"' : ''}`, target, `${quotes ? '"' : ''}></div>`]
    const doc = createDoc('html', contents.join(''))
    const languageService = new CSSLanguageService(settings)
    return languageService.suggestSyntax(doc, doc.positionAt(contents[0].length + target.length), {
        triggerKind: 2,
        triggerCharacter: target.charAt(target.length - 1)
    })
}

// it('types a', () => expect(hint('a')?.length).toBeDefined())

it('types " should hint completions', () => expect(hint('""', { quotes: false })?.length).toBeGreaterThan(0))
it('types \' should hint completions', () => expect(hint('\'\'', { quotes: false })?.length).toBeGreaterThan(0))
it('types   should hint completions', () => expect(hint('text:center ')?.length).toBeGreaterThan(0))
test.todo('types any trigger character in "" should not hint')
test.todo(`types any trigger character in '' should not hint`)
test.todo('animations')

// enhanced

/**
 * <div></div> -> <div class=""></div>
 */
test.todo('emit class="" should hint completions')
test.todo('types { to hint completions for group syntax and fallback')