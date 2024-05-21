import { test, it, expect } from 'vitest'
import { execSync } from 'child_process'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { rm } from '@master/css-shared/utils/fs'

it('init (type="module")', async () => {
    rm(join(__dirname, 'master.css.mjs'))
    execSync('tsx ../../src/bin', { cwd: __dirname })
    const config = (await import('../../src/master.css.mjs.js')).default
    expect(readFileSync(join(__dirname, 'master.css.mjs'), 'utf-8')).toEqual(config)
})