import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Preventing flash of unstyled content',
    description: 'Improve the page loading experience and ensure seamless rendering of content.',
    category: 'Production Optimization',
    other: {
        subject: 'Unstyled Content'
    },
    filename: fileURLToPath(import.meta.url)
})

export default metadata