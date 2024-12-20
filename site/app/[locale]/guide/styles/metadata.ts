import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Styles',
    description: 'A guide to creating abstract styles for your design system.',
    category: 'Customization',
    order: 5,
    filename: fileURLToPath(import.meta.url)
})

export default metadata