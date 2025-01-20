// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import hydrate from '../../hydrate'

describe('cssom', async () => {
    const { generated } = await hydrate(import.meta.url)
    test('layer statement', () => expect(generated.layerStatementRule).toBeDefined())
    test('base', () => expect(generated.layerBlockRules.base.cssRules.length).toBe(1))
    test('theme', () => expect(generated.layerBlockRules.theme.cssRules.length).toBe(2))
    test('preset', () => expect(generated.layerBlockRules.preset.cssRules.length).toBe(1))
    test('components', () => expect(generated.layerBlockRules.components.cssRules.length).toBe(1))
    test('general', () => expect(generated.layerBlockRules.general.cssRules.length).toBe(2))
    test('keyframes', () => expect(Object.keys(generated.keyframesRules).length).toBe(1))
})


