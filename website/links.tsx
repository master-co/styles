import { IconFileText, IconRoad, IconSourceCode } from '@tabler/icons-react'
import roadmap from './app/[locale]/roadmap/metadata'

const links = [
    { name: 'Guide', href: '/guide', Icon: IconFileText },
    { name: 'Reference', fullName: 'API Reference', href: '/reference', Icon: IconFileText },
    { name: 'Play', href: '/play', Icon: IconSourceCode },
    { name: 'Roadmap', href: '/roadmap', Icon: IconRoad, date: roadmap.date },
    // { name: 'Blog', href: '/blog', disabled: true, Icon: IconWriting },
    // { name: 'Components', href: '/components', Icon: IconComponents, disabled: true },
    // { name: 'Templates', href: '/templates', disabled: true }
]

export default links