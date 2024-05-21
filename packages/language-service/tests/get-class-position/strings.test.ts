import { test, it, expect, describe } from 'vitest'
import { expectClassPosition } from './test'

describe('var', () => {
    test('styles with double quotes', () => {
        const target = 'class-b'
        const contents = ['const styles = "class-a ', target, '"']
        expectClassPosition(target, contents, 'js')
    })

    test('styles with single quotes', () => {
        const target = 'class-b'
        const contents = ['const styles = \'class-a ', target, '\'']
        expectClassPosition(target, contents, 'js')
    })

    test('styles with literals', () => {
        const target = 'class-b'
        const contents = ['const styles = `class-a ', target, '`']
        expectClassPosition(target, contents, 'js')
    })
})

describe('object', () => {
    test('styles with double quotes', () => {
        const target = 'class-b'
        const contents = ['const config = { styles: "class-a ', target, '" }']
        expectClassPosition(target, contents, 'js')
    })
})