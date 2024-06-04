import define from 'internal/utils/metadata'

const metadata = define({
    title: 'Runtime with esm.sh CDN',
    description: 'Paste the esm.sh CDN to instantly launch the Master CSS runtime engine.',
    category: 'Installation',
    vercelOG: true,
    filename: import.meta.url
})

export default metadata