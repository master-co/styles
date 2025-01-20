import { test, expect } from 'vitest'
import { MasterCSS } from '../../src'

test('basic', () => {
    expect(new MasterCSS().createFromSelectorText('.font\\:heavy')?.[0]).toMatchObject({ name: 'font:heavy' })
})

test('descendant selector', () => {
    expect(new MasterCSS().createFromSelectorText('.hidden\\_button\\[disabled\\] button[disabled]')?.[0]).toMatchObject({ name: 'hidden_button[disabled]' })
})

test('where', () => {
    expect(new MasterCSS().createFromSelectorText('.ml\\:-50\\_\\:where(\\.code\\,\\.codeTabs\\,\\.demo\\)\\@\\<md')?.[0]).toMatchObject({ name: 'ml:-50_:where(.code,.codeTabs,.demo)@<md' })
})

test('mode', () => {
    expect(new MasterCSS().createFromSelectorText('.light .hidden\@light')?.[0]).toMatchObject({ name: 'hidden@light' })
})

test('component conflicts with the mode', () => {
    expect(new MasterCSS({
        components: {
            'light': 'block font:bold'
        }
    }).createFromSelectorText('.light .light\@light')?.[0]).toMatchObject({ name: '{block;font:bold}', fixedClass: 'light' })
})

test('component and mode', () => {
    expect(new MasterCSS({
        components: {
            'btn': 'block'
        }
    }).createFromSelectorText('.light .btn')?.[0]).toMatchObject({ name: 'block', fixedClass: 'btn' })
})