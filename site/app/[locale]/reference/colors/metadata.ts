import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Colors',
    description: 'Customizing color variables or starting with the crafted palette.',
    category: 'Design Token',
    order: 1,
    filename: fileURLToPath(import.meta.url)
})

export default metadata