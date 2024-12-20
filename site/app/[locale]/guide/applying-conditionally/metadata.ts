import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Applying Conditionally',
    description: 'Apply styles based on theme, print, and other modes and queries.',
    category: 'Syntax Tutorial',
    order: 3,
    disabled: true,
    filename: fileURLToPath(import.meta.url)
})

export default metadata