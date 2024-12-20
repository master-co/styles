import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Cursor',
    description: 'Setting the mouse cursor style.',
    category: 'Syntax',
    canIUseLink: 'https://caniuse.com/?search=cursor',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/cursor',
    filename: fileURLToPath(import.meta.url)
})

export default metadata