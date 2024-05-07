import type { Connection } from 'vscode-languageserver'
import { format } from 'node:util'

function formatMessages(params: any[]): string {
    return params.map((item) => format(item)).join(' ')
}

export default function interceptLogs(console: Console, connection: Connection) {
    console.debug = (...params: any[]) => connection.console.info(formatMessages(params))
    console.error = (...params: any[]) => connection.console.error(formatMessages(params))
    console.warn = (...params: any[]) => connection.console.warn(formatMessages(params))
    console.info = (...params: any[]) => connection.console.info(formatMessages(params))
    console.log = (...params: any[]) => connection.console.log(formatMessages(params))
    return console
}