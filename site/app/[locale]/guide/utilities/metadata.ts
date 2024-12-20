import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Utilities',
    description: 'Customizing utility classes for your design system.',
    category: 'Customization',
    unfinished: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata