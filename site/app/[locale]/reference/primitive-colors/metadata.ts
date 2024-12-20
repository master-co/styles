import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Primitive Colors',
    description: 'Customizing primitive color variables or starting with the official design system.',
    category: 'Design Token',
    order: 2,
    filename: fileURLToPath(import.meta.url)
})

export default metadata