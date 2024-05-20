import { resolve } from 'path'
import { withFixture } from './setup'
import { test } from 'vitest'
import { Settings } from '../src'

const settings: Settings = {
    workspaces: [
        './c'
    ]
}

withFixture('monorepo', async (context) => {
    test.concurrent('workspaces', async ({ expect }) => {
        expect(context.server.workspaces.length).toBe(2)
        expect(context.server.workspaces).toMatchObject([
            { path: resolve('tests/fixtures/monorepo') },
            { path: resolve('tests/fixtures/monorepo/c') },
        ])
    })
}, settings)
