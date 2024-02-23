import { execaCommandSync } from 'execa'
import { join } from 'node:path'
import { existsSync, writeFileSync } from 'node:fs'

writeFileSync(join(__dirname, 'package.json'), JSON.stringify({
    "name": "with-package-json.test",
    "private": true,
    "dependencies": {
        "@master/css": "latest"
    }
}))

it('init', () => {
    execaCommandSync('tsx ../../src/bin', { cwd: __dirname })
    expect(existsSync(join(__dirname, 'node_modules'))).toBeFalsy()
})
