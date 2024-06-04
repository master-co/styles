import define from '~/internal/utils/metadata'
import version from '~/site/app/version'

const metadata = define({
    title: 'Roadmap',
    description: 'v2 is coming soon.',
    date: '2024-03-12T16:19:12.321Z',
    category: 'v' + version,
    authors: [{ name: 'Aron' }],
    filename: import.meta.url
})

export default metadata