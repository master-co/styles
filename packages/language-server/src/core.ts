import { createConnection, TextDocuments, InitializeParams, DidChangeConfigurationNotification, WorkspaceFolder, IPCMessageReader, IPCMessageWriter, Disposable, NotificationType } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import path from 'path'
import { fileURLToPath } from 'url'
import CSSLanguageService from '@master/css-language-service'
import { Settings } from './settings'
import exploreConfig from '@master/css-explore-config'
import extend from '@techor/extend'
import settings from './settings'
import { Config } from '@master/css'
import { SERVER_CAPABILITIES } from '@master/css-language-service'

export default class CSSLanguageServer {
    workspaceFolders: WorkspaceFolder[] = []
    workspaceCSSLanguageService: Record<string, CSSLanguageService> = {}
    workspaceSettings: Record<string, Settings> = {}
    workspaceConfigs: Record<string, Config | undefined> = {}
    connection
    documents: TextDocuments<TextDocument>
    private disposables: Disposable[] = []

    constructor(
        public customSettings?: Settings
    ) {
        if (process.argv.includes('--stdio')) {
            console.log = (...args: any[]) => {
                console.warn(...args)
            }
            this.connection = createConnection(process.stdin, process.stdout)
        } else {
            this.connection = createConnection(
                new IPCMessageReader(process),
                new IPCMessageWriter(process)
            )
        }
        this.documents = new TextDocuments(TextDocument)
        this.disposables.push(
            this.documents.onDidSave(async change => {
                // if the saved file is the master.css file, we need to refresh the css instance
                const name = path.parse(change.document.uri).name
                if (name === 'master.css' || name.endsWith('.css')) {
                    // const cssLanguageService = this.findWorkspaceCSSLanguageService(change.document.uri)
                    // const workspaceFolder = this.findWorkspaceFolder(change.document.uri)
                    // if (cssLanguageService)
                    // cssLanguageService.css.refresh(this.updateWorkspaceConfig(workspaceFolder.uri))
                    this.connection.sendRequest('masterCSS/restart', {
                        title: 'Updating configuration...',
                    })
                }
            }),
            // Make the text document manager listen on the connection
            // for open, change and close text document events
            this.documents.listen(this.connection),
            this.connection.onDidChangeConfiguration(({ settings }) => {
                if (settings?.masterCSS) {
                    this.connection.sendNotification('masterCSS/globalSettingsChanged', settings.masterCSS)
                    this.customSettings = settings.masterCSS
                    this.reload()
                }
            }),
            this.connection.onInitialize((params: InitializeParams) => {
                if (params.workspaceFolders?.length) {
                    this.workspaceFolders = params.workspaceFolders
                } else {
                    if (params.rootUri) {
                        this.workspaceFolders.push({ name: '', uri: params.rootUri })
                    }
                }
                return {
                    capabilities: SERVER_CAPABILITIES
                }
            }),
            this.connection.onInitialized(async () => {
                await this.workspaceFolders.map(async (folder) => {
                    this.workspaceCSSLanguageService[folder.uri] = await this.createLanguageService(folder.uri)
                })
                this.connection.client.register(DidChangeConfigurationNotification.type, undefined)
            }),
            this.connection.onHover((params) => {
                const cssLanguageService = this.findWorkspaceCSSLanguageService(params.textDocument.uri)
                if (cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return cssLanguageService.inspectSyntax(document, params.position)
                }
            }),
            this.connection.onCompletion((params) => {
                const cssLanguageService = this.findWorkspaceCSSLanguageService(params.textDocument.uri)
                if (cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return cssLanguageService.suggestSyntax(document, params.position, params.context)
                }
            }),
            this.connection.onDocumentColor((params) => {
                const cssLanguageService = this.findWorkspaceCSSLanguageService(params.textDocument.uri)
                if (cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return cssLanguageService.renderSyntaxColors(document)
                }
            }),
            this.connection.onColorPresentation((params) => {
                const cssLanguageService = this.findWorkspaceCSSLanguageService(params.textDocument.uri)
                if (cssLanguageService) {
                    const document = this.documents.get(params.textDocument.uri)
                    if (document) return cssLanguageService.editSyntaxColors(document, params.color, params.range)
                }
            }),
            this.connection.onShutdown(() => {
                this.dispose()
            })
        )
    }

    async createLanguageService(workspaceURI: string) {
        const { config, ...workspaceCSSLanguageServiceSettings } = await this.updateWorkspaceSettings(workspaceURI)
        const workspaceConfig = this.workspaceConfigs[workspaceURI]
        return new CSSLanguageService({ ...workspaceCSSLanguageServiceSettings, config: workspaceConfig })
    }

    async updateWorkspaceSettings(workspaceURI: string) {
        const customWorkspaceSettings = await this.connection.workspace.getConfiguration({
            scopeUri: workspaceURI,
            section: 'masterCSS'
        }) as Settings
        const resolvedSettings = extend(settings, this.customSettings, customWorkspaceSettings) as Settings
        this.workspaceSettings[workspaceURI] = resolvedSettings
        this.updateWorkspaceConfig(workspaceURI)
        return resolvedSettings
    }

    updateWorkspaceConfig(workspaceURI: string) {
        const workspaceSettings = this.workspaceSettings[workspaceURI]
        const workspaceCWD = fileURLToPath(workspaceURI.replace('%3A', ':'))
        let workspaceConfig: Config | undefined
        if (typeof workspaceSettings.config === 'string') {
            try {
                workspaceConfig = exploreConfig({ name: workspaceSettings.config, cwd: workspaceCWD })
            } catch (e) {
                console.log('Config loading failed from', workspaceCWD)
                console.error(e)
                console.log('Fall back to default config')
            }
        } else {
            workspaceConfig = workspaceSettings.config
        }
        return this.workspaceConfigs[workspaceURI] = workspaceConfig
    }

    // find the workspace language service for the given uri
    findWorkspaceCSSLanguageService(uri: string): CSSLanguageService | undefined {
        for (const workspaceURI in this.workspaceCSSLanguageService) {
            if (uri.startsWith(workspaceURI)) {
                return this.workspaceCSSLanguageService[workspaceURI]
            }
        }
    }

    findWorkspaceFolder(uri: string): WorkspaceFolder {
        const workspaceFolder = this.workspaceFolders.find(workspace => uri.startsWith(workspace.uri))
        if (!workspaceFolder) {
            throw new Error(`Workspace folder not found for ${uri}`)
        }
        return workspaceFolder
    }

    // revalidate workspace language services by all documents
    async revalidate(documents = this.documents.all()) {
        this.connection.sendNotification('masterCSS/revalidate')
        return await Promise.all(
            documents.map(async (textDocument) => {
                const workspaceFolder = this.findWorkspaceFolder(textDocument.uri)
                return this.workspaceCSSLanguageService[workspaceFolder.uri] = await this.createLanguageService(workspaceFolder.uri)
            })
        )
    }

    async reload() {
        await Promise.all(
            Object.keys(this.workspaceCSSLanguageService)
                .map(async (workspaceURI) => {
                    this.workspaceCSSLanguageService[workspaceURI] = await this.createLanguageService(workspaceURI)
                })
        )
    }

    dispose(): void {
        this.connection.sendNotification('masterCSS/dispose')
        this.disposables.forEach((disposable) => disposable.dispose())
        this.disposables.length = 0
    }
}
