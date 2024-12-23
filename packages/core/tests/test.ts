import { test, expect } from 'vitest'
import { Config, MasterCSS } from '../src'

export const expectLayers = (
    layers: {
        theme?: string
        style?: string
        utility?: string
        keyframe?: string
        preset?: string
    },
    className: string | string[],
    customConfig?: Config
) => {
    const cssRuleText = new MasterCSS(customConfig).add(...(Array.isArray(className) ? className : [className])).text
    if (layers.theme) expect(cssRuleText).toContain(`@layer theme{${layers.theme ?? ''}}`)
    if (layers.style) expect(cssRuleText).toContain(`@layer style{${layers.style ?? ''}}`)
    if (layers.preset) expect(cssRuleText).toContain(`@layer preset{${layers.preset ?? ''}}`)
    if (layers.utility) expect(cssRuleText).toContain(`@layer utility{${layers.utility ?? ''}}`)
    if (layers.keyframe) expect(cssRuleText).toContain(`@layer keyframe{${layers.keyframe ?? ''}}`)
}

test.todo('hidden@sm and flex ordering')