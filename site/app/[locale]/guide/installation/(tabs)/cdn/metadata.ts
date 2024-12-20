import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Using CDNs',
    description: 'Copy and paste CDNs to instantly launch the runtime engine in your browser out of the box.',
    category: 'Getting Started',
    filename: fileURLToPath(import.meta.url)
})

export default metadata