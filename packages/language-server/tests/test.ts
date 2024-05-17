import { withFixture } from './setup'
import { test } from 'vitest'

withFixture('basic', (context) => {
    test.concurrent('root', async ({ expect }) => {
        await context.server.initializing
        // const rootWorkspace = context.server.getWorkspace(context.rootUri)
        // expect(rootWorkspace).toMatchObject({
        //     uri: context.rootUri
        // })
        expect(context.server.workspaces.size).toBe(1)
        expect(context.server.workspaceFolders.length).toBe(1)
    })
})

// test.todo('modify and refresh config')
// test.todo('detect monorepo workspaces')
// test.todo('specify workspaces')
// test.todo('workspace without any config file')
// test.todo('multi-workspace config files')
