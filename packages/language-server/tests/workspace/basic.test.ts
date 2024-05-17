import { withFixture } from '../setup'
import { test } from 'vitest'

withFixture('basic', async (context) => {
    test.concurrent('open and close a document', async ({ expect }) => {
        const rootWorkspace = context.server.getWorkspace(context.rootUri)
        const textDocument = context.createDocument('<div></div>')
        await context.openDocument(textDocument)
        // await new Promise((resolve) => {
        //     context.server.connection.onInitialized(resolve)
        // })
        expect(rootWorkspace?.openedTextDocuments).toEqual({
            uri: textDocument.uri
        })
    })
})
