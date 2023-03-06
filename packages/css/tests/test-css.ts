import '../../../utils/matchMedia.mock'
import '../src/polyfills/css-escape'
import { Config } from '../src'
import { render } from '../src/methods'

export const testCSS = (cls: string, expected: string, config?: Config): void => {
    expect(render(cls.split(' '), config)).toBe(expected)
}

// test class and prop, if expected === undefinded, will use cls as expected value
// examples:
// testProp("z-index:1") // equals to testCSS("z-index:1", ".z-index\\:1{z-index:1}")
// testProp("z-index:1") // equals to testProp("z-index:1", "z-index:1")
export const testProp = (cls: string, expected?: string): void => {
    const selector = CSS.escape(cls)
    if (expected === undefined) {
        expected = cls
    }
    expect(render(cls.split(' '))).toBe(`.${selector}{${expected}}`)
}
