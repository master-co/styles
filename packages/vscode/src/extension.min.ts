import path from 'path'
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node'
import { commands, ExtensionContext, ProgressLocation, window, workspace } from 'vscode'
import { settings } from '@master/css-language-server'

let client: LanguageClient

const disposables: Disposable[] = []

export function activate(context: ExtensionContext) {

    // The server is implemented in node
    const serverModule = context.asAbsolutePath(path.join('dist', 'server.min.cjs'))
    console.log('Loading server from ', serverModule)

    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] }

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    }

    const includedLanguages = workspace.getConfiguration('masterCSS').includedLanguages
    const Languages: { scheme: 'file', language: string }[] = []
    includedLanguages.forEach((x: any) => {
        Languages.push({ scheme: 'file', language: x })
    })

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for html documents
        documentSelector: Languages,
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
        }
    }

    // Create the language client and start the client.
    client = new LanguageClient(
        'masterCSS',
        'Master CSS',
        serverOptions,
        clientOptions
    )

    // Start the client. This will also launch the server
    client.start()
    context.subscriptions.push(
        commands.registerCommand('masterCSS.restart', async () => {
            window.withProgress({
                location: ProgressLocation.Notification,
                title: 'Restarting Master CSS Language Server...',
            }, async () => await client.restart())
        }),
        workspace.onDidChangeConfiguration(async (event) => {
            const affectedProperties = []
            for (const optionName in settings) {
                const property = `masterCSS.${optionName}`
                if (event.affectsConfiguration(property)) {
                    affectedProperties.push(property)
                }
            }
            if (affectedProperties.length) {
                window.withProgress({
                    location: ProgressLocation.Notification,
                    title: `Updating for "${affectedProperties}" ...`,
                }, async () => await client.restart())
            }
        })
    )
}

export function deactivate(): Thenable<void> | undefined {
    unregisterProviders(disposables)

    if (!client) {
        return undefined
    }
    return client.stop()
}

function unregisterProviders(disposables: Disposable[]) {
    disposables.forEach(disposable => disposable?.[Symbol.dispose]())
    disposables.length = 0
}

function dedupe(arg0: any[]) {
    throw new Error('Function not implemented.')
}

