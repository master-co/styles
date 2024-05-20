import { resolve } from 'path'
import { withFixture } from './setup'
import { test } from 'vitest'

withFixture('monorepo', async (context) => {
    test.concurrent('workspaces', async ({ expect }) => {
        expect(context.server.workspaces.length).toBe(3)
        expect(context.server.workspaces).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: resolve('tests/fixtures/monorepo') }),
                expect.objectContaining({ path: resolve('tests/fixtures/monorepo/a') }),
                expect.objectContaining({ path: resolve('tests/fixtures/monorepo/b') }),
            ])
        )
    })

    test('open a document and link it to the nearest workspace', async ({ expect }) => {
        const dir = resolve(__dirname, './fixtures/monorepo/a')
        const textDocument = context.createDocument('', { dir })
        await context.server.onDidOpen({ document: textDocument })
        const targetWorkspace = context.server.workspaces.find((workspace) => workspace.path === resolve(dir))
        expect(targetWorkspace?.openedTextDocuments.length).toBe(1)
        await context.server.onDidClose({ document: textDocument })
        expect(context.rootWorkspace?.openedTextDocuments?.length).toBe(0)
    })
})
