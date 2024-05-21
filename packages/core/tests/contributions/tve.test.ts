import { it, test, expect, describe } from 'vitest'
import { MasterCSS } from '../../src'

describe.concurrent('@tve', () => {
    it.concurrent('scope', () => {
        expect(new MasterCSS({ scope: '.master-css' }).add('pt:2ex').text)
            .toBe('.master-css .pt\\:2ex{padding-top:2ex}')
        expect(new MasterCSS({ scope: '.master-css' }).add('pt:2ex@dark').text)
            .toBe('.dark .master-css .pt\\:2ex\\@dark{padding-top:2ex}')
    })
})
