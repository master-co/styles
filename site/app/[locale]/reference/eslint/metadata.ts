import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'ESLint',
    description: 'The ESLint configuration and plugin reference for Master CSS.',
    category: 'Package',
    filename: fileURLToPath(import.meta.url)
})

export default metadata