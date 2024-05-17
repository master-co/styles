import { createConnection, TextDocuments, InitializeParams, WorkspaceFolder, Disposable, Connection, InitializedNotification } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import path from 'node:path'
import CSSLanguageService, { Settings as CSSLanguageServiceSettings } from '@master/css-language-service'
import { Settings } from './settings'
import exploreConfig from '@master/css-explore-config'
import extend from '@techor/extend'
import settings from './settings'
import { Config } from '@master/css'
import { SERVER_CAPABILITIES } from '@master/css-language-service'
import interceptLogs from './utils/intercept-logs'
import glob from 'fast-glob'
import { URI } from 'vscode-uri'

declare type Workspace = {
    path: string
    uri: string
    openedTextDocuments: Set<TextDocument>
    cssLanguageService?: CSSLanguageService
    languageServiceSettings: CSSLanguageServiceSettings
}

export default class CSSLanguageServer {
    workspaceFolders: WorkspaceFolder[] = []
    workspaces = new Set<Workspace>()
    documents: TextDocuments<TextDocument>
    initializing?: Promise<any[]>
    private disposables: Disposable[] = []

    constructor(
        public connection: Connection = process.argv.includes('--stdio')
            ? createConnection(process.stdin, process.stdout)
            : createConnection(),
        public customSettings?: Settings
    ) {
        if (!process.env.TEST) {
            interceptLogs(console, this.connection)
        }
        this.documents = new TextDocuments(TextDocument)
    }

    start() {
        this.disposables.push(
            this.documents.onDidSave(async change => {
                // if the saved file is the master.css file, we need to refresh the css instance
                const name = path.parse(change.document.uri).name
                if (name === 'master.css' || name.endsWith('.css')) {
                    this.connection.sendRequest('masterCSS/restart', {
                        title: 'Updating Master CSS configuration',
                    })
                }
            }),
            this.documents.onDidOpen(async (params) => {
                await this.init()
                const workspace = this.findClosestWorkspace(params.document.uri)
                if (!workspace || workspace.openedTextDocuments.has(params.document)) return
                if (!workspace.openedTextDocuments.size) {
                    this.initCSSLanguageService(workspace)
                }
                workspace.openedTextDocuments.add(params.document)
            }),
            this.documents.onDidClose(async (params) => {
                await this.init()
                const workspace = this.findClosestWorkspace(params.document.uri)
                if (!workspace) return
                workspace.openedTextDocuments.delete(params.document)
                if (!workspace.openedTextDocuments.size) {
                    this.destroyCSSLanguageService(workspace)
                }
            }),
            this.documents.listen(this.connection),
            this.connection.onDidChangeConfiguration(async ({ settings }) => {
                await this.init()
                if (settings?.masterCSS) {
                    this.connection.sendNotification('masterCSS/globalSettingsChanged', settings.masterCSS)
                    this.customSettings = settings.masterCSS
                    this.connection.sendRequest('masterCSS/restart', {
                        title: 'Updating Master CSS settings',
                    })
                }
            }),
            this.connection.onHover(async (params) => {
                await this.init()
                const workspace = this.findClosestWorkspace(params.textDocument.uri)
                if (workspace?.cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return workspace.cssLanguageService.inspectSyntax(document, params.position)
                }
            }),
            this.connection.onCompletion(async (params) => {
                await this.init()
                const workspace = this.findClosestWorkspace(params.textDocument.uri)
                if (workspace?.cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return workspace.cssLanguageService.suggestSyntax(document, params.position, params.context)
                }
            }),
            this.connection.onDocumentColor(async (params) => {
                await this.init()
                const workspace = this.findClosestWorkspace(params.textDocument.uri)
                if (workspace?.cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return workspace.cssLanguageService.renderSyntaxColors(document)
                }
            }),
            this.connection.onColorPresentation(async (params) => {
                await this.init()
                const workspace = this.findClosestWorkspace(params.textDocument.uri)
                if (workspace?.cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return workspace.cssLanguageService.editSyntaxColors(document, params.color, params.range)
                }
            }),
            // Make the text document manager listen on the connection
            // for open, change and close text document events
            this.connection.onInitialize((params: InitializeParams) => {
                if (params.workspaceFolders?.length) {
                    this.workspaceFolders = params.workspaceFolders
                } else {
                    /**
                     * @deprecated — in favour of workspaceFolders
                     */
                    if (params.rootUri) {
                        this.workspaceFolders.push({ name: '', uri: params.rootUri })
                    }
                }
                return {
                    capabilities: SERVER_CAPABILITIES
                }
            }),
            this.connection.onInitialized(() => this.init()),
            /**
             * In the test environment, this.connection.onInitialized is not executed.
             */
            this.connection.onNotification(InitializedNotification.type, () => {
                console.log('fuck')
                this.init()
            })
        )
        this.connection.listen()
    }

    init() {
        if (this.initializing) return this.initializing
        return this.initializing = Promise.all(
            [
                ...this.workspaceFolders.map((folder) => this.initWorkspaceFolder(folder.uri)),
                // this.connection.client.register(DidChangeConfigurationNotification.type, undefined)
            ]
        )
    }

    private async initWorkspaceFolder(workspaceFolderURI: string) {
        const workspaceFolderCWD = URI.parse(workspaceFolderURI).fsPath
        let customWorkspaceFolderSettings: Settings | undefined
        try {
            customWorkspaceFolderSettings = await this.connection.workspace.getConfiguration({
                scopeUri: workspaceFolderURI,
                section: 'masterCSS'
            }) as Settings
        } catch (error) {
            console.error('Failed to load workspace folder settings', workspaceFolderURI)
            console.error(error)
        }
        const { workspaces, ...languageServiceSettings } = extend(settings, this.customSettings, customWorkspaceFolderSettings) as Settings
        const resolvedWorkspaceDirectories = new Set<string>([workspaceFolderCWD])
        console.info('Registered workspace folder', workspaceFolderURI)
        if (workspaces === 'auto') {
            (await glob('**/master.css.*', {
                cwd: workspaceFolderCWD,
                absolute: true,
                onlyFiles: true,
                ignore: ['**/node_modules/**']
            }))
                .forEach((workspaceFile) => resolvedWorkspaceDirectories.add(path.dirname(workspaceFile)))
        } else if (workspaces?.length) {
            (await glob(workspaces, {
                cwd: workspaceFolderCWD,
                absolute: true,
                onlyDirectories: true,
                ignore: ['**/node_modules/**']
            }))
                .forEach((workspaceDir) => resolvedWorkspaceDirectories.add(workspaceDir))
        }
        resolvedWorkspaceDirectories.forEach(async (workspaceDir) => {
            const workspaceURI = URI.file(workspaceDir).toString()
            console.info('Added workspace', workspaceURI)
            this.workspaces.add({
                path: workspaceDir,
                uri: workspaceURI,
                openedTextDocuments: new Set<TextDocument>(),
                languageServiceSettings
            })
        })
    }

    initCSSLanguageService(workspace: Workspace) {
        let workspaceConfig: Config | undefined
        try {
            workspaceConfig = exploreConfig({
                cwd: workspace.path,
                found: undefined
            })
        } catch (e) {
            console.info('Failed to load config from', workspace)
            console.error(e)
        }
        console.info('Initialized workspace', workspaceConfig ? '(with config file)' : '', workspace.uri)
        workspace.cssLanguageService = new CSSLanguageService({ ...workspace.languageServiceSettings, config: workspaceConfig })
    }

    destroyCSSLanguageService(workspace: Workspace) {
        console.info('Destroyed workspace', workspace.uri)
        delete workspace.cssLanguageService
    }

    findClosestWorkspace(textDocumentURI: string) {
        let foundWorkspace: Workspace | undefined
        for (const workspace of this.workspaces) {
            if (textDocumentURI.startsWith(workspace.uri) && (!foundWorkspace || workspace.uri.length > foundWorkspace.uri.length)) {
                foundWorkspace = workspace
            }
        }
        if (process.env.DEBUG && !foundWorkspace) {
            console.info('No workspace found for', textDocumentURI)
        }
        return foundWorkspace
    }

    getWorkspace(uri: string) {
        return Array.from(this.workspaces).find((workspace) => workspace.uri === uri)
    }

    stop(): void {
        this.connection.sendNotification('masterCSS/dispose')
        this.disposables.forEach((disposable) => disposable.dispose())
        this.disposables.length = 0
        this.connection.dispose()
        this.initializing = undefined
    }
}