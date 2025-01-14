import { test } from 'vitest'
import { expectLayers } from '../test'

test.concurrent('basic', () => {
    expectLayers({ base: '.block\\@base{display:block}' }, 'block@base')
})

test.concurrent('with selectors', () => {
    expectLayers({ base: '.font\\:12_\\:is\\(code\\,pre\\)\\@base :is(code,pre){font-size:0.75rem}' }, 'font:12_:is(code,pre)@base')
})