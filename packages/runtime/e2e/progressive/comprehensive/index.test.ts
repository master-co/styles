import { expect, test } from '@playwright/test'
import init from '../../init'
import config from './master.css'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test('basic', async ({ page }) => {
    const prerenderCSS = readFileSync(resolve(__dirname, 'prerender.css'), 'utf-8')
    const prerenderHTML = readFileSync(resolve(__dirname, 'prerender.html'), 'utf-8')
    await page.evaluate((html) => document.body.innerHTML = html, prerenderHTML)
    await init(page, prerenderCSS, config)
    const rules = await page.evaluate(() => globalThis.runtimeCSS.rules)
    expect(rules.map(({ name }) => name)).toEqual(['layer-statement', 'theme', 'fade', 'base', 'preset', 'components', 'general'])
})
