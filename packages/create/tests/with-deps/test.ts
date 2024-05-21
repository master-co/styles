import { test, it, expect, beforeAll } from 'vitest'
import { execSync } from 'child_process'
import { join } from 'node:path'
import { existsSync, writeFileSync } from 'node:fs'
import { rm, mkdir } from 'shared/utils/fs'

beforeAll(() => {
    rm(join(__dirname, 'dist'))
    mkdir(join(__dirname, 'dist'))
    writeFileSync(join(__dirname, './dist/package.json'), JSON.stringify({
        'name': 'with-package-json.test',
        'private': true,
        'dependencies': {
            '@master/css': 'latest'
        }
    }))
})

it('init', () => {
    execSync('tsx ../../../src/bin', { cwd: join(__dirname, 'dist')})
    expect(existsSync(join(__dirname, './dist/node_modules'))).toBeFalsy()
})
