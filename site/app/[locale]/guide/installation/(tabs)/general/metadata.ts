import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'General Installation',
    description: 'The easiest way to use Master CSS from scratch is to initialize the runtime engine directly in the entry file.',
    category: 'Getting Started',
    filename: fileURLToPath(import.meta.url)
})

export default metadata