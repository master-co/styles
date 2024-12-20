import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Background Position',
    description: 'Setting the initial position for background image.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=background-position',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/background-position',
    filename: fileURLToPath(import.meta.url)
})

export default metadata