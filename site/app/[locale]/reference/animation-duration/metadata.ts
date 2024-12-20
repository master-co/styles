import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Animation Duration',
    description: 'Setting the length of time that an animation takes to complete one cycle.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=animation-duration',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration',
    filename: fileURLToPath(import.meta.url)
})

export default metadata