import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: {
        absolute: 'Introduction to Master CSS'
    },
    description: 'The CSS language and framework for rapidly building modern and high-performance websites.',
    category: 'Getting Started',
    other: {
        subject: 'Introduction'
    },
    order: 1,
    filename: fileURLToPath(import.meta.url)
})

export default metadata