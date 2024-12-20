import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Animation Name',
    description: 'Setting the names of the animation.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=animation-name',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name',
    filename: fileURLToPath(import.meta.url)
})

export default metadata