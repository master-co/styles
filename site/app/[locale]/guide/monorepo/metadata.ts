import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Monorepo',
    description: 'A guide to setting up Master CSS in a modern repository.',
    category: 'Getting Started',
    filename: fileURLToPath(import.meta.url)
})

export default metadata