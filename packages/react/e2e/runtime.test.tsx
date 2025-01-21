import { test, expect } from '@playwright/experimental-ct-react'
import RuntimeComponent from './Runtime'

test('Runtime - class changed', async ({ page, mount }) => {
    const runtimeComponentInstance = await mount(<RuntimeComponent></RuntimeComponent>)
    await runtimeComponentInstance.waitFor({ state: 'visible' })

    const $button = await page.$('#config-btn')
    await $button?.evaluateHandle(($button) => $button.classList.add('f:10'))
    expect(await page.evaluate(() => globalThis.runtimeCSS.classUsages)).toEqual({
        'btn': 1,
        'f:10': 1
    })

    await runtimeComponentInstance.unmount()
    expect(await page.evaluate(() => globalThis.runtimeCSS.style)).toBeNull()
    expect(await page.evaluate(() => globalThis.runtimeCSSs.length)).toBe(0)
})

test('Runtime - config changed', async ({ page, mount }) => {
    const runtimeComponentInstance = await mount(<RuntimeComponent></RuntimeComponent>)
    await runtimeComponentInstance.waitFor({ state: 'visible' })
    expect(await page.evaluate(() => globalThis.runtimeCSS.text)).toContain('.btn{border:0.125rem rgb(var(--red)) solid}')

    const $button = await page.$('#config-btn')
    await $button?.click()
    expect(await page.evaluate(() => globalThis.runtimeCSS.text)).not.toContain('.btn{border:0.125rem rgb(var(--red)) solid}')
})

test('Runtime - root changed', async ({ page, mount }) => {
    const runtimeComponentInstance = await mount(<RuntimeComponent></RuntimeComponent>)
    await runtimeComponentInstance.waitFor({ state: 'visible' })

    const $button = await page.$('#root-btn')
    await $button?.click()
    expect(await page.evaluate(() => globalThis.runtimeCSSs[0].classUsages)).toEqual({
        'f:1000': 1
    })
})
