import { Duplex } from 'stream'
import { createConnection, createProtocolConnection } from 'vscode-languageserver/node'
import CSSLanguageServer, { Settings } from '../src'

export function connect(settings?: Settings) {
    class TestStream extends Duplex {
        _write(chunk: string, _encoding: BufferEncoding, done: () => void) {
            this.emit('data', chunk)
            done()
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        _read(_size: number) { }
    }
    const input = new TestStream()
    const output = new TestStream()
    const serverConnection = createConnection(input, output)
    const server = new CSSLanguageServer(serverConnection, settings)
    const clientConnection = createProtocolConnection(output, input)
    clientConnection.listen()
    server.start()
    return {
        server,
        clientConnection,
        serverConnection,
    }
}
