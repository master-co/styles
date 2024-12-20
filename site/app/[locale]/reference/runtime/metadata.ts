import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Runtime',
    description: 'The core syntax parsing and runtime engine of Master CSS.',
    category: 'Package',
    filename: fileURLToPath(import.meta.url)
})

export default metadata