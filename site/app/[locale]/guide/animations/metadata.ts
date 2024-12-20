import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Animations',
    description: 'Customizing animation keyframes for your design system.',
    category: 'Customization',
    filename: fileURLToPath(import.meta.url)
})

export default metadata