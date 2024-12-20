import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Normal CSS',
    description: 'Normalize browser\'s styles ~600B.',
    category: 'Package',
    filename: fileURLToPath(import.meta.url)
})

export default metadata