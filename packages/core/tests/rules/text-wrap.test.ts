import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('basic', () => {
    expect(new MasterCSS().create('text:wrap')?.text).toContain('.text\\:wrap{text-wrap:wrap}')
    expect(new MasterCSS().create('text:nowrap')?.text).toContain('.text\\:nowrap{text-wrap:nowrap}')
    expect(new MasterCSS().create('text:balance')?.text).toContain('.text\\:balance{text-wrap:balance}')
    expect(new MasterCSS().create('text:pretty')?.text).toContain('.text\\:pretty{text-wrap:pretty}')
})
