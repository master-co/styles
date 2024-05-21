import { it, test, expect } from 'vitest'
import { MasterCSS } from '../src'

test.concurrent('container queries', () => {
    expect(new MasterCSS().add('font:32@container|sidebar(min-width:800px)').text)
        .toBe('@container  sidebar(min-width:800px){.font\\:32\\@container\\|sidebar\\(min-width\\:800px\\){font-size:2rem}}')
})
