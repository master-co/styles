import { test, expect } from 'vitest'
import { selectorTextToName } from '../../src'

test('basic', () => {
    expect(selectorTextToName('.font\\:heavy')).toBe('font:heavy')
    expect(selectorTextToName('.hidden\\_button\\[disabled\\] button[disabled]')).toBe('hidden_button[disabled]')
    expect(selectorTextToName('.ml\\:-50\\_\\:where(\\.code\\,\\.codeTabs\\,\\.demo\\)\\@\\<md')).toBe('ml:-50_:where(.code,.codeTabs,.demo)@<md')
})