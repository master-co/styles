import { test, expect } from '@playwright/test'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test('extends', async ({ page }) => {
    await page.evaluate(() => {
        globalThis.masterCSSConfigs = [{
            variables: {
                primary: '#000000'
            }
        }]
        globalThis.masterCSSConfig = {
            extends: [{
                variables: {
                    secondary: '#ffffff'
                }
            }]
        }
    })
    await page.addScriptTag({ path: resolve(__dirname, '../dist/global.min.js') })
    expect(await page.evaluate(() => globalThis.masterCSSConfigs)).toBeDefined()
    expect(await page.evaluate(() => globalThis.runtimeCSS.variables.primary)).toBeDefined()
    expect(await page.evaluate(() => globalThis.runtimeCSS.variables.secondary)).toBeDefined()
    expect(await page.evaluate(() => globalThis.runtimeCSS.customConfig.extends?.length)).toBe(2)
})