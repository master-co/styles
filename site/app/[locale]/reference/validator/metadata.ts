import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Validator',
    description: 'Validator for Master CSS syntactic class.',
    category: 'Package',
    filename: fileURLToPath(import.meta.url)
})

export default metadata