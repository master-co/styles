import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Animation',
    description: 'Applying an animation between styles.',
    category: 'Syntax',
    canIUseLink: 'https://caniuse.com/?search=animation',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation',
    filename: fileURLToPath(import.meta.url)
})

export default metadata