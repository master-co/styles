import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Migrating from Styled Components',
    description: 'A guide on how to refactor Styled Components using Master CSS.',
    category: 'Migration',
    vercelOG: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata