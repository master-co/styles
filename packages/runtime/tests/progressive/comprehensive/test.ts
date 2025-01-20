// @vitest-environment jsdom
import { describe, expect, test } from 'vitest'
import hydrate from '../../hydrate'

describe('hydration', async () => {
    const { runtimeCSS } = await hydrate(import.meta.url)

    test('base', () => {
        expect(runtimeCSS.baseLayer.rules[0]).toMatchObject({
            name: 'list-style:none_ul@base',
            nodes: [
                {
                    native: { selectorText: '.list-style\\:none_ul\\@base ul' },
                    text: '.list-style\\:none_ul\\@base ul{list-style:none}'
                }
            ]
        })
    })

    test('theme', () => {
        expect(runtimeCSS.themeLayer.rules[0]).toMatchObject({
            name: 'primary',
            nodes: [
                {
                    native: { selectorText: '.light,:root' },
                    text: '.light,:root {--primary: 0 0 0;}'
                },
                {
                    native: { selectorText: '.dark' },
                    text: '.dark {--primary: 255 255 255;}'
                }
            ]
        })
        expect(runtimeCSS.themeLayer.usages).toEqual({ primary: 1 })
    })

    test('preset', () => {
        expect(runtimeCSS.presetLayer.rules[0]).toMatchObject({
            name: 'text:16_p@preset',
            nodes: [
                {
                    native: { selectorText: '.text\\:16_p\\@preset p' },
                    text: '.text\\:16_p\\@preset p{font-size:1rem;line-height:calc(1rem + 0.875em)}'
                }
            ]
        })
    })

    test('components', () => {
        expect(runtimeCSS.componentsLayer.rules[0]).toMatchObject({
            name: '{inline-flex;bg:primary}',
            nodes: [
                {
                    native: { selectorText: '.btn' },
                    text: '.btn{display:inline-flex;background-color:rgb(var(--primary))}'
                }
            ]
        })
    })

    test('general', () => {
        expect(runtimeCSS.generalLayer.rules[0]).toMatchObject({
            name: 'flex',
            nodes: [
                {
                    native: { selectorText: '.flex' },
                    text: '.flex{display:flex}'
                }
            ]
        })
        expect(runtimeCSS.generalLayer.rules[1]).toMatchObject({
            name: '@fade|1s',
            nodes: [
                {
                    native: { selectorText: '.\\@fade\\|1s' },
                    text: '.\\@fade\\|1s{animation:fade 1s}'
                }
            ]
        })
    })

    test('keyframes', () => {
        expect(runtimeCSS.animationsNonLayer.usages).toEqual({ fade: 1 })
        expect(runtimeCSS.animationsNonLayer.rules[0]).toMatchObject({
            name: 'fade',
            nodes: [
                {
                    native: {
                        cssRules: [
                            {
                                keyText: '0%',
                                style: { opacity: '0' }
                            },
                            {
                                keyText: 'to',
                                style: { opacity: '1' }
                            }
                        ]
                    }
                }
            ]
        })
    })
})


