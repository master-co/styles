import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Runtime Rendering',
    description: 'Observe for changes to class names in the DOM tree to manipulate CSS rules and sync to the runtime stylesheet.',
    category: 'Rendering Modes',
    filename: fileURLToPath(import.meta.url)
})

export default metadata