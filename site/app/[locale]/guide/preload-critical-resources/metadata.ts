import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Preloading critical resources',
    description: 'The runtime engine plays a crucial role in the initial display of a page.',
    category: 'Production Optimization',
    other: {
        subject: 'Critical Resources'
    },
    filename: fileURLToPath(import.meta.url)
})

export default metadata