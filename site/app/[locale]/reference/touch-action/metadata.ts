import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Touch Action',
    description: 'Setting how an element\'s region can be manipulated by a touchscreen user.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=touch-action',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action',
    filename: fileURLToPath(import.meta.url)
})

export default metadata