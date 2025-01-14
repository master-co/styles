import { test } from 'vitest'
import { expectLayers } from '../test'

test.concurrent('basic', () => {
    expectLayers({ preset: '.block\\@preset{display:block}' }, 'block@preset')
})

test.concurrent('with selectors', () => {
    expectLayers({ preset: '.font\\:12_\\:is\\(code\\,pre\\)\\@preset :is(code,pre){font-size:0.75rem}' }, 'font:12_:is(code,pre)@preset')
})