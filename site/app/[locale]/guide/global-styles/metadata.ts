import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Global Styles',
    description: 'Normalize browser and preset global styles for more concise-style programming.',
    category: 'Customization',
    order: 1,
    filename: fileURLToPath(import.meta.url)
})

export default metadata