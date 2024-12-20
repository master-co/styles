import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Order',
    description: 'Changing the order of item in flex or grid container.',
    category: 'Syntax',
    unfinished: true,
    canIUseLink: 'https://caniuse.com/?search=order',
    mdnLink: 'https://developer.mozilla.org/en-US/docs/Web/CSS/order',
    filename: fileURLToPath(import.meta.url)
})

export default metadata