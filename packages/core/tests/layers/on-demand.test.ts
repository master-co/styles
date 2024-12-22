import { expect, test } from 'vitest'
import { MasterCSS } from '../../src'

test.concurrent('empty', () => {
    const css = new MasterCSS()
    expect(css.text).toBe(css.layerStatementRule.text)
})

test.concurrent('utility', () => {
    const css = new MasterCSS()
    css.add('text:center')
    expect(css.text).toContain(css.layerStatementRule.text)
    expect(css.text).toContain('@layer utility{.text\\:center{text-align:center}}')
})

test.concurrent('theme', () => {
    const css = new MasterCSS()
    css.add('fg:blue')
    expect(css.text).toContain(css.layerStatementRule.text)
    expect(css.text).toContain('@layer utility{.fg\\:blue{color:rgb(var(--text-blue))}}')
    expect(css.text).toContain('@layer theme{.light,:root{--text-blue:37 99 253}.dark{--text-blue:112 176 255}}')
})

test.concurrent('manipulate', () => {
    const css = new MasterCSS({ styles: { 'btn': 'block' } })
    expect(css.text).toContain(css.layerStatementRule.text)
    css.add('text:center', 'font:bold')
    expect(css.text).toContain('@layer utility{.font\\:bold{font-weight:700}.text\\:center{text-align:center}}')
    css.add('btn')
    expect(css.text).toContain('@layer style{.btn{display:block}')
    css.remove('text:center', 'font:bold', 'btn')
    expect(css.text).toBe(css.layerStatementRule.text)
})