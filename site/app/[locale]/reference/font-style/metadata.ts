import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Font Style',
    description: 'Setting font style of an element.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=font-style',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-style',
    filename: fileURLToPath(import.meta.url)
})

export default metadata