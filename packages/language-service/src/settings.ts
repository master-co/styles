/* eslint-disable quotes */
import { Config } from '@master/css'

/**
 * @example styles https://regex101.com/r/HLPdsw/1
 **/

const settings: Settings = {
    includedLanguages: [
        "html",
        "php",
        "javascript",
        "typescript",
        "javascriptreact",
        "typescriptreact",
        "vue",
        "svelte",
        "rust",
        "astro",
        "markdown",
        "mdx",
        "astro"
    ],
    /**
     * @example <div class="a b">
     * @example <div className="a b">
     */
    classAttributes: [
        "class",
        "className"
    ],
    /**
     * @example <div class={active ? 'a' : 'b'}>
     * @example <div className={active ? 'a' : 'b'}>
     */
    classAttributeBindings: {
        "className": ["{", "}"],
        "class": ["{", "}"],
        "class:list": ["{", "}"],
        ":class": ["\"", "\""],
        "v-bind:class": ["\"", "\""],
        "[class]": ["\"", "\""],
        "[className]": ["\"", "\""],
        "[ngClass]": ["\"", "\""]
    },
    /**
     * @example const styles = 'a b'
     * @example { styles: { btn: 'a b' } }
     */
    classDeclarations: [
        "styles"
    ],
    /**
     * @example clsx('a b')
     * @example styled`a b`
     * @example .classList.add('a')
     */
    classFunctions: [
        "clsx",
        "cva",
        "class",
        "styled(?:\\s+)?(?:\\.\\w+)?",
        "classList(?:\\s+)?\\.(?:add|remove|toggle|replace)"
    ],
    exclude: ["**/.git/**", "**/node_modules/**", "**/.hg/**"],
    suggestSyntax: true,
    inspectSyntax: true,
    renderSyntaxColors: true,
    editSyntaxColors: true
}

export default settings

export declare type Settings = {
    includedLanguages?: string[]
    classAttributes?: string[]
    classDeclarations?: string[]
    classFunctions?: string[]
    classAttributeBindings?: Record<string, [string, string] | false>
    exclude?: string[]
    config?: Config
    // features
    suggestSyntax?: boolean
    inspectSyntax?: boolean
    renderSyntaxColors?: boolean
    editSyntaxColors?: boolean
}