import type { PropertiesHyphen } from 'csstype'
import type SyntaxType from '../syntax-type'
import type { SyntaxRule } from '../syntax-rule'
import type { ValueComponent } from './syntax'
import type { syntaxes, utilities } from '../config'

export interface SyntaxDefinition {
    type?: SyntaxType
    matcher?: RegExp
    sign?: string
    key?: string
    subkey?: string
    ambiguousKeys?: string[]
    ambiguousValues?: (RegExp | string)[]
    variables?: string[]
    separators?: string[]
    unit?: any
    declarations?: PropertiesHyphen
    includeAnimations?: boolean
    analyze?: (this: SyntaxRule, className: string) => [valueToken: string, prefixToken?: string]
    transformValue?(this: SyntaxRule, value: string): string
    transformValueComponents?(this: SyntaxRule, valueComponents: ValueComponent[]): ValueComponent[]
    declare?(this: SyntaxRule, value: string, valueComponents: ValueComponent[]): PropertiesHyphen
    delete?(this: SyntaxRule, className: string): void
    create?(this: SyntaxRule, className: string): void
    insert?(this: SyntaxRule): void
}


export type VariableValue = number | string | false | (number | string)[]
export type VariableDefinition = { [key in '' | `@${string}` | string]?: VariableValue | VariableDefinition } | VariableValue
export type CSSKeyframes = Record<'from' | 'to' | string, PropertiesHyphen>
export type AnimationDefinitions = Record<string, CSSKeyframes>;
export type SelectorDefinitions = Record<string, string | string[]>;
export interface AtDefinitions { [key: string]: number | string | AtDefinitions }
export interface StyleDefinitions { [key: string]: string | StyleDefinitions }
export type SyntaxDefinitions = Partial<Record<keyof typeof syntaxes | string, SyntaxDefinition>>
export type VariableDefinitions = { [key in keyof typeof syntaxes]?: VariableDefinition } & Record<string, VariableDefinition>
export type UtilityDefinitions = { [key in keyof typeof utilities]?: PropertiesHyphen } & Record<string, PropertiesHyphen>
export type ModeDefinitions = Record<string, 'class' | 'media' | 'host' | false>;
export interface FunctionDefinition {
    unit?: string
    transform?(this: SyntaxRule, value: string, bypassVariableNames: string[]): string | ValueComponent[]
}
export type FunctionDefinitions = Record<string, FunctionDefinition>;

export interface Config {
    extends?: (Config | any)[]
    styles?: StyleDefinitions
    at?: AtDefinitions
    selectors?: SelectorDefinitions
    utilities?: UtilityDefinitions
    variables?: VariableDefinitions
    syntaxes?: SyntaxDefinitions
    rootSize?: number
    baseUnit?: number
    defaultMode?: 'light' | 'dark' | string | false
    scope?: string
    important?: boolean
    override?: boolean
    functions?: FunctionDefinitions
    animations?: AnimationDefinitions
    modes?: ModeDefinitions
}