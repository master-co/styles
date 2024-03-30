import CSSLanguageService from '../src/core'
import createDoc from '../src/utils/create-doc'

test('empty class', () => {
    const contents = ['<div class="', '"></div>']
    const doc = createDoc('html', contents.join(''))
    const languageService = new CSSLanguageService()
    expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
        range: {
            start: contents[0].length,
            end: contents[0].length
        },
        token: ''
    })
})

test('one class', () => {
    const target = 'class-a'
    const contents = ['<div class="', target, '"></div>']
    const doc = createDoc('html', contents.join(''))
    const languageService = new CSSLanguageService()
    expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
        range: {
            start: contents[0].length,
            end: contents[0].length + target.length
        },
        token: target
    })
})

test('two classes', () => {
    const target = 'class-b'
    const contents = ['<div class="class-a ', target, '"></div>']
    const doc = createDoc('html', contents.join(''))
    const languageService = new CSSLanguageService()
    expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
        range: {
            start: contents[0].length,
            end: contents[0].length + target.length
        },
        token: target
    })
})

describe('react', () => {
    test('clsx in className={}', () => {
        const target = 'class-b'
        const contents = ['export default () => <div className={clsx("class-a","', target, '")}></div>']
        const doc = createDoc('tsx', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
            range: {
                start: contents[0].length,
                end: contents[0].length + target.length
            },
            token: target
        })
    })
})

describe('vue', () => {
    test('class in class array', () => {
        const target = 'class-a'
        const contents = ['<div :class="[ isActive && `', target, '` ]"></div>']
        const doc = createDoc('vue', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
            range: {
                start: contents[0].length,
                end: contents[0].length + target.length
            },
            token: target
        })
    })

    test('class in object syntax', () => {
        const target = 'class-a'
        const contents = ['<div :class="{ \'', target, '\': isActive }"></div>']
        const doc = createDoc('vue', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
            range: {
                start: contents[0].length,
                end: contents[0].length + target.length
            },
            token: target
        })
    })

    test('class in ternary operator', () => {
        const target = 'class-a'
        const contents = ['<div :class="isActive ? \'', target, '\' : inactiveClass"></div>']
        const doc = createDoc('vue', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
            range: {
                start: contents[0].length,
                end: contents[0].length + target.length
            },
            token: target
        })
    })

    test('class in v-bind', () => {
        const target = 'class-a'
        const contents = ['<div v-bind:class="', target, '"></div>']
        const doc = createDoc('vue', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
            range: {
                start: contents[0].length,
                end: contents[0].length + target.length
            },
            token: target
        })
    })
})

describe('svelte', () => {
    test('class in ternary operator', () => {
        const target = 'class-a'
        const contents = ['<div class="{ isActive ? \'', target , '\' : inactiveClass }"></div>']
        const doc = createDoc('svelte', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
            range: {
                start: contents[0].length,
                end: contents[0].length + target.length
            },
            token: target
        })
    })

    /**
     * ? svelte's 'class:xx={isActive}' is not supported
     */
})