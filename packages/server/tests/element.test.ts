import { it, test, expect } from 'vitest'
import { render } from '../src'

it('render elements', () => {
    expect(render([
        '<div class="text:center"></div>',
        '<div class="bg:white"></div>'
    ].join('')).html).toEqual([
        '<style id="master">@layer base,preset,theme,style,utility;@layer theme{}@layer keyframe{}@layer style{}@layer utility{.bg\\:white{background-color:rgb(255 255 255)}.text\\:center{text-align:center}}</style>',
        '<div class="text:center"></div>',
        '<div class="bg:white"></div>'
    ].join(''))
})