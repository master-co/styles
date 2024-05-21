import { test, it, expect, describe } from 'vitest'
import { expectClassPosition } from './test'

describe.concurrent('var', () => {
    test.concurrent('styles with double quotes', () => {
        const target = 'class-b'
        const contents = ['const styles = "class-a ', target, '"']
        expectClassPosition(target, contents, 'js')
    })

    test.concurrent('styles with single quotes', () => {
        const target = 'class-b'
        const contents = ['const styles = \'class-a ', target, '\'']
        expectClassPosition(target, contents, 'js')
    })

    test.concurrent('styles with literals', () => {
        const target = 'class-b'
        const contents = ['const styles = `class-a ', target, '`']
        expectClassPosition(target, contents, 'js')
    })
})

describe.concurrent('object', () => {
    test.concurrent('styles with double quotes', () => {
        const target = 'class-b'
        const contents = ['const config = { styles: "class-a ', target, '" }']
        expectClassPosition(target, contents, 'js')
    })
})