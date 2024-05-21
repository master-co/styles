import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('text-decoration color', () => {
    expect(new MasterCSS().create('text-decoration:#000')?.text).toBe('.text-decoration\\:\\#000{text-decoration-color:#000}')
    // expect(new MasterCSS().create('text-decoration:rgb(0,0,0)')?.text).toBe('.text-decoration\\:rgb\\(0\\,0\\,0\\){text-decoration-color:rgb(0,0,0)}')
    // expect(new MasterCSS().create('text-decoration:oklab(0%,0,0)')?.text).toBe('.text-decoration\\:oklab\\(0\\%\\,0\\,0\\){text-decoration-color:oklab(0%,0,0)}')
})

// test.concurrent('text-decoration style', () => {
//     expect(new MasterCSS().create('text:solid')?.text).toBe('.text\\:solid{text-decoration-style:solid}')
// })