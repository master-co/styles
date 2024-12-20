import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Background Repeat',
    description: 'Setting how background images are repeated.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=background-repeat',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat',
    filename: fileURLToPath(import.meta.url)
})

export default metadata