import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Static Extraction in Blazor',
    description: 'Guide to setting up Master CSS static extraction in your Blazor project.',
    category: 'Installation',
    vercelOG: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata