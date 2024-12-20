import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Scroll Snap Stop',
    description: 'Setting whether scroll container is pass over snap positions.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=scroll-snap-stop',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop',
    filename: fileURLToPath(import.meta.url)
})

export default metadata