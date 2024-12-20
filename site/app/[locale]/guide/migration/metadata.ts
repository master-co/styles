import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: {
        absolute: 'Migrating to Master CSS'
    },
    description: 'Migrate your CSS technology to Master CSS and learn the differences and benefits.',
    category: 'Getting Started',
    other: {
        subject: 'Migration'
    },
    order: 5,
    filename: fileURLToPath(import.meta.url)
})

export default metadata