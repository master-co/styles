import { SpawndChildProcess } from 'spawnd'
import { spawnd } from 'spawnd'

let serverProcess: SpawndChildProcess

beforeAll(() => {
    serverProcess = spawnd('node ./index --node-ipc', { shell: true, cwd: __dirname })
})

it('run server', async () => {
    expect(serverProcess).toBeDefined()
})

test.todo('modify and refresh config')
test.todo('detect monorepo workspaces')
test.todo('specify workspaces')
test.todo('workspace without any config file')
test.todo('multi-workspace config files')

afterAll(async () => {
    await serverProcess.destroy()
}, 60000)