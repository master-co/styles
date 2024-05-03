import CSSLanguageServer from '@master/css-language-server'

const server = new CSSLanguageServer()

server.connection.listen()

process.on('unhandledRejection', (e) => {
    console.error(`Unhandled rejection`, e)
})