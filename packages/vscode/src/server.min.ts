import CSSLanguageServer from '@master/css-language-server'

const server = new CSSLanguageServer()

server.start()

process.on('unhandledRejection', (e) => {
    console.error(`Unhandled rejection`, e)
})