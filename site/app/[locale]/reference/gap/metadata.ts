import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Gap',
    description: 'Setting the gutters between rows and columns.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=gap',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/gap',
    filename: fileURLToPath(import.meta.url)
})

export default metadata