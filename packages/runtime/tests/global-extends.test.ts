import { beforeAll, expect, it } from 'vitest'

beforeAll(async () => {
    window.masterCSSConfigs = [{
        variables: {
            primary: '#000000'
        }
    }]
    window.masterCSSConfig = {
        extends: [{
            variables: {
                secondary: '#ffffff'
            }
        }]
    }
    await import('../src/global.min')
})

it('should include masterCSSConfigs', () => {
    expect(window.masterCSSConfigs).toBeDefined()
    expect(window.runtimeCSS.variables.primary).toBeDefined()
    expect(window.runtimeCSS.variables.secondary).toBeDefined()
    expect(window.runtimeCSS.customConfig.extends?.length).toBe(2)
})