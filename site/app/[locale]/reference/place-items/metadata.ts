import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Place Items',
    description: 'Setting align-items and justify-items at the same time.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=place-items',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/place-items',
    filename: fileURLToPath(import.meta.url)
})

export default metadata