'use client'

import type { App } from 'internal/contexts/app'
import { IconCompass, IconFileText, IconRoad, IconSourceCode } from '@tabler/icons-react'
import roadmap from './[locale]/roadmap/metadata'
import CSSLogotype from 'internal/components/CSSLogotype'
import categories from './categories'
import version from './version'

export default {
    version,
    navs: [
        { name: 'Guide', href: '/guide', Icon: IconCompass },
        { name: 'Reference', fullName: 'API Reference', href: '/reference', Icon: IconFileText },
        { name: 'Play', href: '/play', Icon: IconSourceCode },
        { name: 'Roadmap', href: '/roadmap', Icon: IconRoad, date: roadmap.date },
        // { name: 'Blog', href: '/blog', disabled: true, Icon: IconWriting },
        // { name: 'Components', href: '/components', Icon: IconComponents, disabled: true },
        // { name: 'Templates', href: '/templates', disabled: true }
    ],
    categories,
    Logotype: CSSLogotype
} as App