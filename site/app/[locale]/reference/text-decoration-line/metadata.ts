import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Text Decoration Line',
    description: 'Setting the kind of decoration that is used on text.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=text-decoration-line',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line',
    filename: fileURLToPath(import.meta.url)
})

export default metadata