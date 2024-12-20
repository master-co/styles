import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Malleable Styles',
    description: 'A revolutionary technology that makes abstract styles transformable.',
    category: 'Fundamentals',
    disabled: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata