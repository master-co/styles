import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Direction',
    description: 'Setting the direction of text.',
    category: 'Syntax',
    canIUseLink: 'https://caniuse.com/?search=direction',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/direction',
    filename: fileURLToPath(import.meta.url)
})

export default metadata