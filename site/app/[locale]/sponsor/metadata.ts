import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Sponsor',
    description: 'Donate a small portion of your income benefiting from us to help grow.',
    category: 'MIT License',
    filename: fileURLToPath(import.meta.url)
})

export default metadata