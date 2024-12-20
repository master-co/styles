import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Runtime Rendering in Laravel',
    description: 'Guide to setting up Master CSS runtime rendering in your Laravel project.',
    category: 'Installation',
    vercelOG: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata