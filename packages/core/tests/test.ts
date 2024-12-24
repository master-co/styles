import { test, expect } from 'vitest'
import { Config, MasterCSS } from '../src'

export const expectLayers = (
    layers: {
        theme?: string
        styles?: string
        normal?: string
        animations?: string
        preset?: string
    },
    className: string | string[],
    customConfig?: Config
) => {
    const cssRuleText = new MasterCSS(customConfig).add(...(Array.isArray(className) ? className : [className])).text
    if (layers.theme) expect(cssRuleText).toContain(`@layer theme{${layers.theme ?? ''}}`)
    if (layers.styles) expect(cssRuleText).toContain(`@layer styles{${layers.styles ?? ''}}`)
    if (layers.preset) expect(cssRuleText).toContain(`@layer preset{${layers.preset ?? ''}}`)
    if (layers.normal) expect(cssRuleText).toContain(`@layer normal{${layers.normal ?? ''}}`)
    if (layers.animations) expect(cssRuleText).toContain(`${layers.animations ?? ''}`)
}

test.todo('hidden@sm and flex ordering')