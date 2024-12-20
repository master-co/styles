import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Animation Fill Mode',
    description: 'Setting how a CSS animation applies styles to its target before and after its execution.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=animation-fill-mode',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode',
    filename: fileURLToPath(import.meta.url)
})

export default metadata