import { fileURLToPath } from 'url'
import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Minimizing CSS',
    description: 'Reduce on-page CSS output and complexity using Master CSS APIs.',
    category: 'Production Optimization',
    unfinished: true,
    other: {
        subject: 'Minimization'
    },
    filename: fileURLToPath(import.meta.url)
})

export default metadata