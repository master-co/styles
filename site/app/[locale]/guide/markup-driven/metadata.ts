import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Markup-driven CSS',
    description: 'Master CSS styles are driven by template markups and generate CSS rules on demand.',
    category: 'Fundamentals',
    other: {
        subject: 'Markup-driven'
    },
    order: 2,
    filename: fileURLToPath(import.meta.url)
})

export default metadata