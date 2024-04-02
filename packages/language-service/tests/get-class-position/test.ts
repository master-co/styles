import { Settings } from '../../src'
import CSSLanguageService from '../../src/core'
import createDoc, { languageIdOfExt } from '../../src/utils/create-doc'

export const expectClassPosition = (target: string, contents: string[], ext: keyof typeof languageIdOfExt = 'html', settings?: Settings) => {
    const doc = createDoc(ext, contents.join(''))
    const languageService = new CSSLanguageService()
    expect(languageService.getClassPosition(doc, doc.positionAt(contents[0].length + target.length))).toEqual({
        range: {
            start: contents[0].length,
            end: contents[0].length + target.length
        },
        token: target
    })
}

test('empty class with single quotes', () => {
    const target = ''
    const contents = ['<div class=\'', target, '\'></div>']
    expectClassPosition(target, contents)
})

test('empty class with double quotes', () => {
    const target = ''
    const contents = ['<div class="', target, '"></div>']
    expectClassPosition(target, contents)
})

test('one class', () => {
    const target = 'class-a'
    const contents = ['<div class="', target, '"></div>']
    expectClassPosition(target, contents)
})

test('two classes', () => {
    const target = 'class-b'
    const contents = ['<div class="class-a ', target, '"></div>']
    expectClassPosition(target, contents)
})

test('valid classes', () => {
    const target = 'bg:black'
    const contents = ['<div class="class-a ', target, '"></div>']
    expectClassPosition(target, contents)
})

test('quote in class', () => {
    const target = `content:''`
    const contents = ['<div class="class-a ', target, '"></div>']
    expectClassPosition(target, contents)
})

test('group syntax', () => {
    const target = '{abs}'
    const contents = ['<div class="class-a ', target, '"></div>']
    expectClassPosition(target, contents)
})

test('nested strings and literals', () => {
    const target = `content:\\'\\'`
    const contents = [`export default () => <div className={'block `, target, `'}>hello world</div>`]
    expectClassPosition(target, contents)
})
