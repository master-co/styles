'use client'

import type { App } from 'internal/contexts/app'
import { IconCompass, IconFileText, IconRoad, IconSourceCode } from '@tabler/icons-react'
import Logotype from 'internal/components/CSSLogotype'

export default {
    navs: [
        { name: 'Guide', href: '/guide', Icon: IconCompass },
        { name: 'Reference', fullName: 'API Reference', href: '/reference', Icon: IconFileText },
        { name: 'Play', href: '/play', Icon: IconSourceCode },
        // { name: 'Roadmap', href: '/roadmap', Icon: IconRoad, date: roadmap.date },
        // { name: 'Blog', href: '/blog', disabled: true, Icon: IconWriting },
        // { name: 'Components', href: '/components', Icon: IconComponents, disabled: true },
        // { name: 'Templates', href: '/templates', disabled: true }
    ],
    versions: [
        { name: 'v1.37.3', href: 'https://css.master.co' }
    ],
    Logotype
} as App