import { Settings } from '../src'
import CSSLanguageService from '../src/core'
import createDoc, { languageIdOfExt } from '../src/utils/create-doc'

const expectClassPosition = (target: string, contents: string[], ext: keyof typeof languageIdOfExt = 'html', settings?: Settings) => {
    const doc = createDoc(ext, contents.join(''))
    const languageService = new CSSLanguageService()
    expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toEqual({
        range: {
            start: contents[0].length,
            end: contents[0].length + target.length
        },
        token: target
    })
}

test('empty class', () => {
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

test('master-css classes', () => {
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

describe('react', () => {
    test('empty binding -> className={}', () => {
        const contents = ['export default () => <div className={', '', '}></div>']
        const doc = createDoc('tsx', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toBeUndefined()
    })

    test('empty binding -> className={""}', () => {
        const target = ''
        const contents = ['export default () => <div className={"', target, '"}></div>']
        expectClassPosition(target, contents, 'tsx')
    })

    test('empty binding -> className={clsx()}', () => {
        const contents = ['export default () => <div className={clsx(', '', ')}></div>']
        const doc = createDoc('tsx', contents.join(''))
        const languageService = new CSSLanguageService()
        expect(languageService.getClassPosition(doc, { line: 0, character: contents[0].length })).toBeUndefined()
    })

    test('clsx() two classes', () => {
        const target = 'class-b'
        const contents = ['export default () => <div className={clsx("class-a","', target, '")}></div>']
        expectClassPosition(target, contents, 'tsx')
    })

    test('quote in clsx()', () => {
        const target = `content:''`
        const contents = ['export default () => <div className={clsx("class-a","', target, '")}></div>']
        expectClassPosition(target, contents)
    })
})

describe('vue', () => {
    test('class in class array', () => {
        const target = 'class-a'
        const contents = ['<div :class="[ isActive && `', target, '` ]"></div>']
        expectClassPosition(target, contents, 'vue')
    })

    test('class in object syntax', () => {
        const target = 'class-a'
        const contents = ['<div :class="{ \'', target, '\': isActive }"></div>']
        expectClassPosition(target, contents, 'vue')
    })

    test('class in ternary operator', () => {
        const target = 'class-a'
        const contents = ['<div :class="isActive ? \'', target, '\' : inactiveClass"></div>']
        expectClassPosition(target, contents, 'vue')
    })

    test('class in v-bind', () => {
        const target = 'class-a'
        const contents = ['<div v-bind:class="', target, '"></div>']
        expectClassPosition(target, contents, 'vue')
    })
})

describe('svelte', () => {
    // test('class in ternary operator', () => {
    //     const target = 'class-a'
    //     const contents = ['<div class="{ isActive ? \'', target, '\' : inactiveClass }"></div>']
    //     expectClassPosition(target, contents, 'svelte')
    // })

    /**
     * ? svelte's 'class:xx={isActive}' is not supported
     */
})