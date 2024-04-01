/* eslint-disable quotes */
import { Config } from '@master/css'

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
    classAttributes: ["class", "className"],
    classAssignments: {
        // react
        "className=": ["{", "}"],
        // vue
        ":class=": ["\"", "\""],
        "v-bind:class=": ["\"", "\""],
        // svelte
        "class=": ["{", "}"],
        // angular
        "[class]=": ["\"", "\""],
        "[className]=": ["\"", "\""],
        "[ngClass]=": ["\"", "\""],
        // astro
        "class:list=": ["{", "}"],
        // invoke
        "clsx": ["(", ")"],
        "styled": ["(", ")"],
        "cva": ["(", ")"]
    },
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
    classAssignments?: Record<string, [string, string] | false>
    exclude?: string[]
    config?: Config
    // features
    suggestSyntax?: boolean
    inspectSyntax?: boolean
    renderSyntaxColors?: boolean
    editSyntaxColors?: boolean
}