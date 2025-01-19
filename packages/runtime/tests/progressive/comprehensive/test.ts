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

    test('styles', () => {
        expect(runtimeCSS.stylesLayer.rules[0]).toMatchObject({
            name: '{inline-flex;bg:primary}',
            nodes: [
                {
                    native: { selectorText: '.btn' },
                    text: '.btn{display:inline-flex;background-color:rgb(var(--primary))}'
                }
            ]
        })
    })

    test('keyframes', () => {
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
        expect(runtimeCSS.animationsNonLayer.usages).toEqual({ fade: 1 })
    })
})


