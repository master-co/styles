import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Progressive Rendering in Svelte',
    description: 'Guide to setting up Master CSS progressive rendering in your Svelte project.',
    category: 'Installation',
    vercelOG: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata