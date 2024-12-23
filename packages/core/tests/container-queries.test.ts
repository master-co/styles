import { test, expect } from 'vitest'
import { MasterCSS } from '../src'
import { expectLayers } from './test'

test.concurrent('container queries', () => {
    expectLayers(
        {
            normal: '@container  sidebar(min-width:800px){.font\\:32\\@container\\|sidebar\\(min-width\\:800px\\){font-size:2rem}}'
        },
        'font:32@container|sidebar(min-width:800px)'
    )
})
