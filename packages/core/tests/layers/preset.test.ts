import { test } from 'vitest'
import { expectLayers } from '../test'

test.concurrent('add to @layer preset by @preset', () => {
    expectLayers({ preset: '.block\\@preset{display:block}' }, 'block@preset')
})