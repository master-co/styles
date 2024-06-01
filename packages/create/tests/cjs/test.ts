import { test, it, expect } from 'vitest'
import { execSync } from 'child_process'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { rm } from 'shared/utils/fs'

it('init cjs', async () => {
    rm(join(__dirname, 'master.css.js'))
    execSync('tsx ../../src/bin', { cwd: __dirname })
    const config = (await import('../../src/master.css.js.js')).default
    expect(readFileSync(join(__dirname, 'master.css.js'), 'utf-8')).toEqual(config)
})
