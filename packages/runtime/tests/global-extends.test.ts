import { beforeAll, expect, it } from 'vitest'

beforeAll(async () => {
    globalThis.masterCSSConfigs = [{
        variables: {
            primary: '#000000'
        }
    }]
    globalThis.masterCSSConfig = {
        extends: [{
            variables: {
                secondary: '#ffffff'
            }
        }]
    }
    await import('../src/global.min')
})

it('should include masterCSSConfigs', () => {
    expect(globalThis.masterCSSConfigs).toBeDefined()
    expect(globalThis.runtimeCSS.variables.primary).toBeDefined()
    expect(globalThis.runtimeCSS.variables.secondary).toBeDefined()
    expect(globalThis.runtimeCSS.customConfig.extends?.length).toBe(2)
})