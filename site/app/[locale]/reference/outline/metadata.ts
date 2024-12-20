import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Outline',
    description: 'Setting all the outline properties at once.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=outline',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/outline',
    filename: fileURLToPath(import.meta.url)
})

export default metadata