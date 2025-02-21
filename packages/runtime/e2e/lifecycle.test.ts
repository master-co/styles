import { test, expect } from '@playwright/test'
import init from './init'

test('destroy on progressive', async ({ page }) => {
    await init(page, '@layer base, theme, preset, components, general;')
    await page.evaluate(() => {
        document.body.classList.add('text:center')
    })
    expect(await page.evaluate(() => globalThis.runtimeCSS.generalLayer.rules.length)).toBe(1)
    expect(await page.evaluate(() => Array.from(globalThis.runtimeCSS.style?.sheet?.cssRules || [])
        .filter(cssRule => cssRule === globalThis.runtimeCSS.generalLayer.native)
        .length
    )).toBe(1)
    expect(await page.evaluate(() => Array.from(globalThis.runtimeCSS.style?.sheet?.cssRules || []).length)).toBe(2)
    await page.evaluate(() => {
        globalThis.runtimeCSS.destroy()
    })
    expect(await page.evaluate(() => globalThis.runtimeCSS.generalLayer.rules.length)).toBe(0)
    expect(await page.evaluate(() => Array.from(globalThis.runtimeCSS.style?.sheet?.cssRules || []).length)).toBe(1)
    await page.evaluate(() => {
        globalThis.runtimeCSS.init()
        globalThis.runtimeCSS.observe()
        document.body.classList.add('block')
        document.body.classList.add('font:bold')
    })
    expect(await page.evaluate(() => Array.from(globalThis.runtimeCSS.style?.sheet?.cssRules || []).length)).toBe(2)
})