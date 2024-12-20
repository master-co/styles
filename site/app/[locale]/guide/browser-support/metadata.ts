import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Browser Support',
    description: 'The core engine of Master CSS hardly affects CSS support for browsers.',
    category: 'Fundamentals',
    filename: fileURLToPath(import.meta.url)
})

export default metadata