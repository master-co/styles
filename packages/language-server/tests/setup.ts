import { ClientCapabilities, Connection, DidCloseTextDocumentNotification, DidCloseTextDocumentParams, DidOpenTextDocumentNotification, DidOpenTextDocumentParams, IPCMessageReader, IPCMessageWriter, InitializeParams, InitializeRequest, InitializedNotification, TextDocumentItem, createConnection, createProtocolConnection } from 'vscode-languageserver/node'
import CSSLanguageServer, { Settings } from '../src'
import { beforeAll, describe } from 'vitest'
import { resolve } from 'node:path'
import { URI } from 'vscode-uri'
import { Duplex } from 'node:stream'
import createDocument from '../src/utils/create-document'
import { connect } from './connection'

declare type FixtureContext = {
    server: CSSLanguageServer,
    fixtureDir: string,
    rootUri: string,
    workspaceFolders: { uri: string, name: string }[],
    client: Connection,
    createDocument: (text: string, options?: { lang?: string, dir?: string }) => TextDocumentItem,
    openDocument: (textDocument: TextDocumentItem) => Promise<void>,
    closeDocument: (uri: string) => Promise<void>,
}

export function withFixture(fixture: string, cb: (context: FixtureContext) => void, settings?: Settings) {
    describe(fixture, async () => {
        const context = {}
        beforeAll(async () => {
            const fixtureDir = resolve(__dirname, `../fixtures/${fixture}`)
            const workspaceFolders = [{
                uri: URI.file(fixtureDir).toString(),
                name: 'test'
            }]
            const rootUri = workspaceFolders[0].uri
            const { server, clientConnection } = connect(settings)
            Object.setPrototypeOf(context, {
                server,
                fixtureDir,
                rootUri,
                workspaceFolders,
                createDocument: (text: string, options?: { lang?: string, dir?: string }) => {
                    return createDocument(text, { lang: options?.lang, dir: options?.dir || fixtureDir })
                },
                openDocument: async (textDocument: TextDocumentItem) => {
                    await server.connection.sendNotification(DidOpenTextDocumentNotification.type, {
                        textDocument
                    } as DidOpenTextDocumentParams)
                },
                closeDocument: async (uri: string) => {
                    await server.connection.sendNotification(DidCloseTextDocumentNotification.type, {
                        textDocument: {
                            uri
                        }
                    } as DidCloseTextDocumentParams)
                }
            } as FixtureContext)
            const capabilities: ClientCapabilities = {
                textDocument: {
                    codeAction: { dynamicRegistration: false },
                    codeLens: { dynamicRegistration: false },
                    colorProvider: { dynamicRegistration: false },
                    completion: {
                        completionItem: {
                            commitCharactersSupport: true,
                            documentationFormat: ['markdown', 'plaintext'],
                            snippetSupport: true,
                        },
                        completionItemKind: {
                            valueSet: [
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                25,
                            ],
                        },
                        contextSupport: true,
                        dynamicRegistration: false,
                    },
                    definition: { dynamicRegistration: false },
                    documentHighlight: { dynamicRegistration: false },
                    documentLink: { dynamicRegistration: false },
                    documentSymbol: {
                        dynamicRegistration: false,
                        symbolKind: {
                            valueSet: [
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                25, 26,
                            ],
                        },
                    },
                    formatting: { dynamicRegistration: false },
                    hover: {
                        contentFormat: ['markdown', 'plaintext'],
                        dynamicRegistration: false,
                    },
                    implementation: { dynamicRegistration: false },
                    onTypeFormatting: { dynamicRegistration: false },
                    publishDiagnostics: { relatedInformation: true },
                    rangeFormatting: { dynamicRegistration: false },
                    references: { dynamicRegistration: false },
                    rename: { dynamicRegistration: false },
                    signatureHelp: {
                        dynamicRegistration: false,
                        signatureInformation: { documentationFormat: ['markdown', 'plaintext'] },
                    },
                    synchronization: {
                        didSave: true,
                        dynamicRegistration: false,
                        willSave: true,
                        willSaveWaitUntil: true,
                    },
                    typeDefinition: { dynamicRegistration: false },
                },
                workspace: {
                    applyEdit: true,
                    configuration: true,
                    didChangeConfiguration: { dynamicRegistration: false },
                    didChangeWatchedFiles: { dynamicRegistration: false },
                    executeCommand: { dynamicRegistration: false },
                    symbol: {
                        dynamicRegistration: false,
                        symbolKind: {
                            valueSet: [
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
                                25, 26,
                            ],
                        },
                    },
                    workspaceEdit: { documentChanges: true },
                    workspaceFolders: true,
                }
            }
            await clientConnection.sendRequest(InitializeRequest.type, {
                rootUri,
                capabilities,
                workspaceFolders,
                trace: 'verbose'
            } as InitializeParams)
            await clientConnection.sendNotification(InitializedNotification.method, {})
            // await server.init()
            return () => {
                server.stop()
                clientConnection.dispose()
            }
        })
        cb(context as FixtureContext)
    })
}