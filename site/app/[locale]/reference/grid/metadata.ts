import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Grid',
    description: 'Setting layout of grid system.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=grid',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/grid',
    filename: fileURLToPath(import.meta.url)
})

export default metadata