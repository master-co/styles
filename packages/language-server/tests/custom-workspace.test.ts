import { resolve } from 'path'
import { withFixture } from './setup'
import { test } from 'vitest'
import { Settings } from '../src'
import { URI } from 'vscode-uri'

const settings: Settings = {
    workspaces: [
        './c'
    ]
}

withFixture('monorepo', async (context) => {
    test('workspaces', async ({ expect }) => {
        expect(context.server.workspaces.length).toBe(2)
        expect(context.server.workspaces.map((x) => x.uri)).toEqual(
            expect.arrayContaining([
                URI.file(resolve('tests/fixtures/monorepo')).toString(),
                URI.file(resolve('tests/fixtures/monorepo/c')).toString(),
            ])
        )
    })
}, settings)
