import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Syntaxes',
    description: 'A guide to customizing declarations, selectors, functions, and at-rules in syntax.',
    category: 'Customization',
    order: 3,
    unfinished: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata