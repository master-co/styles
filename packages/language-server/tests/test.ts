import { withFixture } from './setup'
import { test } from 'vitest'

withFixture('basic', async (context) => {
    test.concurrent('root workspace', async ({ expect }) => {
        expect(context.server.workspaces.length).toBe(1)
        expect(context.server.workspaces[0].uri).toBe(context.rootUri)
    })

    test.concurrent('open and close a document', async ({ expect }) => {
        const textDocument = context.createDocument()
        await context.server.onDidOpen({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(1)
        expect(context.rootWorkspace?.openedTextDocuments).toEqual([textDocument])
        await context.server.onDidClose({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(0)
    })
})


// test.todo('modify and refresh config')
// test.todo('detect monorepo workspaces')
// test.todo('specify workspaces')
// test.todo('workspace without any config file')
// test.todo('multi-workspace config files')
