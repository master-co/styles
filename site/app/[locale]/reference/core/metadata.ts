import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Core',
    description: 'The core syntax parsing of Master CSS.',
    category: 'Package',
    filename: fileURLToPath(import.meta.url)
})

export default metadata