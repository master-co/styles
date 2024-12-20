import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Reusing Styles',
    description: 'A guide to reusing styles and code de-duplication.',
    category: 'Fundamentals',
    filename: fileURLToPath(import.meta.url)
})

export default metadata