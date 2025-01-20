import { test, it, expect, describe } from 'vitest'
import { expectClassPosition } from './test'

describe.concurrent('var', () => {
    test.concurrent('components with double quotes', () => {
        const target = 'class-b'
        const contents = ['const components = "class-a ', target, '"']
        expectClassPosition(target, contents, 'js')
    })

    test.concurrent('components with single quotes', () => {
        const target = 'class-b'
        const contents = ['const components = \'class-a ', target, '\'']
        expectClassPosition(target, contents, 'js')
    })

    test.concurrent('components with literals', () => {
        const target = 'class-b'
        const contents = ['const components = `class-a ', target, '`']
        expectClassPosition(target, contents, 'js')
    })
})

describe.concurrent('object', () => {
    test.concurrent('components with double quotes', () => {
        const target = 'class-b'
        const contents = ['const config = { components: "class-a ', target, '" }']
        expectClassPosition(target, contents, 'js')
    })
})