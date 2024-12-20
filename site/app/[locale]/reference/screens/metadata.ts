import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Screens',
    description: 'Customizing screen sizes and breakpoints for your design system.',
    category: 'Design Token',
    filename: fileURLToPath(import.meta.url)
})

export default metadata