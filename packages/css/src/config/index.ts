import mediaQueries from './media-queries'
import selectors from './selectors'
import semantics from './semantics'
import animations from './animations'
import variables from './variables'
import rules from './rules'
import functions from './functions'
import { CSSDeclarations } from '../types/css-declarations'
import type { Rule, RuleOptions, ValueComponent } from '../rule'

const config: Config = {
    mediaQueries,
    selectors,
    semantics,
    rules,
    functions: functions as any,
    animations,
    variables: variables as any,
    scope: '',
    rootSize: 16,
    override: false,
    important: false,
    themeDriver: 'class'
}

export {
    config,
    mediaQueries,
    selectors,
    semantics,
    rules,
    functions,
    animations,
    variables
}


export type ConfigVariable = number | string | Array<number | string>
export type ConfigVariableGroup = { [key in '' | `@${string}`]?: ConfigVariable } & { [key: string]: ConfigVariable | ConfigVariableGroup }
export type ConfigFunction = {
    unit?: string
    colored?: boolean
    transform?(this: Rule, value: string): string | ValueComponent[]
}

export interface Config {
    extends?: (Config | { config: Config })[]
    styles?: { [key: string]: string | Config['styles'] }
    mediaQueries?: { [key: string]: number | string | Config['mediaQueries'] }
    selectors?: { [key: string]: string | string[] | Config['selectors'] }
    semantics?: { [key in keyof typeof semantics]?: CSSDeclarations } & { [key: string]: CSSDeclarations }
    variables?: { [key in keyof typeof rules]?: ConfigVariableGroup }
    & { [key: string]: ConfigVariableGroup | ConfigVariable }
    rules?: { [key in keyof typeof rules | string]?: RuleOptions }
    rootSize?: number
    scope?: string
    important?: boolean
    override?: boolean
    functions?: Record<string, ConfigFunction>,
    animations?: Record<string, { [key in 'from' | 'to']?: CSSDeclarations } & { [key: string]: CSSDeclarations }>
    themeDriver?: 'class' | 'media' | 'host'
}
