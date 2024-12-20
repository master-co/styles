import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'CLI',
    description: 'Command line interface for Master CSS.',
    category: 'Package',
    filename: fileURLToPath(import.meta.url)
})

export default metadata