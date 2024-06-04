import define from '~/internal/utils/metadata'
import version from '~/site/app/version'

const metadata= define({
    title: 'Play',
    description: 'A real-time code editor for Master CSS.',
    category: `v${version}`,
    openGraph: {
        title: 'Playground'
    },
    filename: import.meta.url
})

export default metadata