import { it, test, expect } from 'vitest'
import { MasterCSS } from '../../../src'
import config from '../../config'
import { expectLayers } from '../../test'

test.concurrent('orientation', () => {
    expectLayers(
        {
            normal: '@media (orientation:landscape){.hidden\\@landscape{display:none}}'
        },
        'hidden@landscape',
        config
    )

    expectLayers(
        {
            normal: '@media (orientation:portrait){.hidden\\@portrait{display:none}}'
        },
        'hidden@portrait',
        config
    )
})

test.concurrent('prefers-reduced-motion', () => {
    expectLayers(
        {
            normal: '@media (prefers-reduced-motion:no-preference){.hidden\\@motion{display:none}}'
        },
        'hidden@motion',
        config
    )

    expectLayers(
        {
            normal: '@media (prefers-reduced-motion:reduce){.hidden\\@reduced-motion{display:none}}'
        },
        'hidden@reduced-motion',
        config
    )
})

test.concurrent('mixed', () => {
    expectLayers(
        {
            normal: '@media (prefers-reduced-motion:no-preference) and (orientation:landscape){.hidden\\@motion\\&landscape{display:none}}'
        },
        'hidden@motion&landscape',
        config
    )
})

test.concurrent('at', () => {
    expectLayers(
        {
            normal: '@media (max-device-width:42mm) and (min-device-width:38mm){.hidden\\@watch{display:none}}'
        },
        'hidden@watch',
        config
    )

    expectLayers(
        {
            normal: '@media (max-device-width:42mm) and (min-device-width:38mm){.hidden\\@device-watch{display:none}}'
        },
        'hidden@device-watch',
        config
    )

    expectLayers(
        {
            normal: '@media (max-device-width:42mm) and (min-device-width:38mm){.hidden\\@device-watch{display:none}}'
        },
        'hidden@device-watch',
        config
    )

    expectLayers(
        {
            normal: '@supports (transform-origin:5% 5%){.hidden\\@supports\\(transform-origin\\:5\\%\\|5\\%\\){display:none}}'
        },
        'hidden@supports(transform-origin:5%|5%)',
        config
    )

    expectLayers(
        {
            normal: '.christmas .fg\\:black\\@christmas{color:rgb(0 0 0)}'
        },
        'fg:black@christmas',
        { ...config, modes: { christmas: 'class' }}
    )

    expectLayers(
        {
            normal: '@media (min-width:1024px){.christmas .fg\\:black\\@christmas\\@md{color:rgb(0 0 0)}}'
        },
        'fg:black@christmas@md',
        { ...config, modes: { christmas: 'class' }}
    )
})

test.concurrent('viewports', () => {
    expectLayers(
        {
            normal: '@media (min-width:768px){.hidden\\@tablet{display:none}}'
        },
        'hidden@tablet',
        config
    )

    expectLayers(
        {
            normal: '@media (min-width:1024px){.hidden\\@laptop{display:none}}'
        },
        'hidden@laptop',
        config
    )

    expectLayers(
        {
            normal: '@media (min-width:1280px){.hidden\\@desktop{display:none}}'
        },
        'hidden@desktop',
        config
    )

    expectLayers(
        {
            normal: '@media (min-width:2500px){.hidden\\@custom-1{display:none}}'
        },
        'hidden@custom-1',
        config
    )
})
