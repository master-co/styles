import { Position } from 'vscode-languageserver-textdocument'
import CSSLanguageService from '../../src/core'
import createDoc from '../../src/utils/create-doc'
import { Settings } from '../../src/settings'
import dedent from 'ts-dedent'

const hint = (target: string, { quotes = true, settings }: { quotes?: boolean, settings?: Settings } = {}) => {
    const contents = [`export default () => <div className=${quotes ? '"' : ''}`, target, `${quotes ? '"' : ''}></div>`]
    const doc = createDoc('tsx', contents.join(''))
    const languageService = new CSSLanguageService(settings)
    return languageService.suggestSyntax(doc, { line: 0, character: contents[0].length } as Position, {
        triggerKind: 2, // todo
        triggerCharacter: target.charAt(target.length - 1)
    })
}

it('types next class and starts with white space', () => {
    const target = ''
    const contents = [`export default () => <div className="abs `, target, `"></div>`]
    const doc = createDoc('tsx', contents.join(''))
    const languageService = new CSSLanguageService()
    const completionItems = languageService.suggestSyntax(doc, { line: 0, character: contents[0].length } as Position, {
        triggerKind: 2,
        triggerCharacter: target.charAt(target.length - 1)
    })
    expect(completionItems?.find(({ label }) => label === 'block')).toBeDefined()
})

it('types next class and starts with b', () => {
    const target = 'b'
    const contents = [`export default () => <div className="abs `, target, `"></div>`]
    const doc = createDoc('tsx', contents.join(''))
    const languageService = new CSSLanguageService()
    const completionItems = languageService.suggestSyntax(doc, { line: 0, character: contents[0].length } as Position, {
        triggerKind: 2,
        triggerCharacter: target.charAt(target.length - 1)
    })
    expect(completionItems?.find(({ label }) => label === 'block')).toBeDefined()
})