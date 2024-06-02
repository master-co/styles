import type { Project } from 'internal/contexts/project'
import { IconCompass, IconFileText, IconRoad, IconSourceCode } from '@tabler/icons-react'
import roadmap from './app/[locale]/roadmap/metadata'
import CSSLogotype from 'internal/components/CSSLogotype'

export default {
    version: '2.0.0-rc.40',
    navs: [
        { name: 'Guide', href: '/guide', Icon: IconCompass },
        { name: 'Reference', fullName: 'API Reference', href: '/reference', Icon: IconFileText },
        { name: 'Play', href: '/play', Icon: IconSourceCode },
        { name: 'Roadmap', href: '/roadmap', Icon: IconRoad, date: roadmap.date },
        // { name: 'Blog', href: '/blog', disabled: true, Icon: IconWriting },
        // { name: 'Components', href: '/components', Icon: IconComponents, disabled: true },
        // { name: 'Templates', href: '/templates', disabled: true }
    ],
    Logotype: CSSLogotype
} as Project