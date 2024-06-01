import { test, it, expect } from 'vitest'
import { execSync } from 'child_process'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { rm } from 'shared/utils/fs'

it('init by tsconfig.json', async () => {
    rm(join(__dirname, 'master.css.ts'))
    execSync('tsx ../../src/bin', { cwd: __dirname })
    const config = (await import('../../src/master.css.ts.js')).default
    expect(readFileSync(join(__dirname, 'master.css.ts'), 'utf-8')).toEqual(config)
})