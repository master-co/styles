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
    classStrings: [
        ["\\sclass=", "\"", "\""],
        ["\\sclass=", "'", "'"],
        ["\\sclassName=", "\"", "\""],
        ["\\sclassName=", "'", "'"],
        ["\\sstyled(?:\\s+)?(?:\\.\\w+)?", "`", "`"],
        ["\\sstyles(?:\\s+)?(?::|=)(?:\\s+)?", "\"", "\""],
        ["\\sstyles(?:\\s+)?(?::|=)(?:\\s+)?", "'", "'"],
        ["\\sstyles(?:\\s+)?(?::|=)(?:\\s+)?", "`", "`"]
    ],
    classAssignments: [
        ["\\sclassName=", "{", "}"],
        ["\\sclass=", "{", "}"],
        ["\\sclass:list=", "{", "}"],
        ["\\sstyles(?:\\s+)?(?::|=)(?:\\s+)?", "{", "}"],
        ["\\s:class=", "\"", "\""],
        ["\\sv-bind:class=", "\"", "\""],
        ["\\s[class]=", "\"", "\""],
        ["\\s[className]=", "\"", "\""],
        ["\\s[ngClass]=", "\"", "\""],
        ["\\sclsx", "(", ")"],
        ["\\scva", "(", ")"],
        ["\\.class", "(", ")"],
        ["\\sstyled(?:\\s+)?(?:\\.\\w+)?", "(", ")"],
        ["\\.classList(?:\\s+)?(?:\\.(add|remove|toggle|replace))", "(", ")"]
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
    classStrings?: [string, string, string][]
    classAssignments?: [string, string, string][]
    exclude?: string[]
    config?: Config
    // features
    suggestSyntax?: boolean
    inspectSyntax?: boolean
    renderSyntaxColors?: boolean
    editSyntaxColors?: boolean
}