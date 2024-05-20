import CSSLanguageServer from '@master/css-language-server'

const server = new CSSLanguageServer(undefined, { verbose: true })

server.start()

process.on('unhandledRejection', (e) => {
    console.error(`Unhandled rejection`, e)
})