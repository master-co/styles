import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'User Select',
    description: 'Controlling whether the user can select text.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=user-select',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/user-select',
    filename: fileURLToPath(import.meta.url)
})

export default metadata