import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: {
        absolute: 'Installing Master CSS'
    },
    description: 'Master CSS allows you to install from package managers, copy-paste CDNs, and even integrate with frameworks.',
    category: 'Getting Started',
    other: {
        subject: 'Installation'
    },
    order: 2,
    filename: fileURLToPath(import.meta.url)
})

export default metadata