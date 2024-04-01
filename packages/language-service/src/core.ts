import { MasterCSS } from '@master/css'
import extend from '@techor/extend'
import EventEmitter from 'node:events'
import type { Position } from 'vscode-languageserver-protocol'
import settings, { type Settings } from './settings'
import { minimatch } from 'minimatch'
import { fileURLToPath } from 'node:url'
import inspectSyntax from './features/inspect-syntax'
import renderSyntaxColors from './features/render-syntax-colors'
import editSyntaxColors from './features/edit-syntax-colors'
import suggestSyntax from './features/suggest-syntax'
import { TextDocument } from 'vscode-languageserver-textdocument'

export default class CSSLanguageService extends EventEmitter {
    css: MasterCSS
    settings: Settings

    constructor(
        public customSettings?: Settings
    ) {
        super()
        this.settings = extend(settings, customSettings)
        this.css = new MasterCSS(this.settings.config)
    }

    inspectSyntax(...params: Parameters<typeof inspectSyntax>) {
        if (this.settings.inspectSyntax && this.isDocumentAccepted(params[0]))
            return inspectSyntax?.call(this, ...params)
    }

    renderSyntaxColors(...params: Parameters<typeof renderSyntaxColors>) {
        if (this.settings.renderSyntaxColors && this.isDocumentAccepted(params[0]))
            return renderSyntaxColors?.call(this, ...params)
    }

    editSyntaxColors(...params: Parameters<typeof editSyntaxColors>) {
        if (this.settings.editSyntaxColors && this.isDocumentAccepted(params[0]))
            return editSyntaxColors?.call(this, ...params)
    }

    suggestSyntax(...params: Parameters<typeof suggestSyntax>) {
        if (this.settings.suggestSyntax && this.isDocumentAccepted(params[0]))
            return suggestSyntax?.call(this, ...params)
    }

    getClassPosition(textDocument: TextDocument, position: Position): { range: { start: number, end: number }, token: string } | undefined {
        const positionIndex = textDocument.offsetAt(position)
        const startIndex = textDocument.offsetAt({ line: position.line - 100, character: 0 }) ?? 0
        const endIndex = textDocument.offsetAt({ line: position.line + 100, character: 0 }) ?? undefined
        const text = textDocument.getText().substring(startIndex, endIndex)
        const lang = textDocument.languageId
        const { classAttributes, classAssignments } = this.settings
        const normalizeClassNamePosition = (className: string, attrStart: number) => {
            /**
             * Matching classes, including empty string after white space
             * @example <div class="class-a class-b "></div>
             * @url https://regex101.com/r/LnBLAV/1
             */
            for (const eachClassMatch of className.matchAll(/(?:[^\s]+)?/g)) {
                if (eachClassMatch.index === undefined) continue
                const token = eachClassMatch[0]
                const classStartIndex = attrStart + eachClassMatch.index
                const classEndIndex = classStartIndex + token.length
                if (classStartIndex <= positionIndex - startIndex && positionIndex - startIndex <= classEndIndex) {
                    return {
                        range: { start: classStartIndex, end: startIndex + classEndIndex },
                        token
                    }
                } else if (attrStart === classEndIndex) {
                    return {
                        range: { start: attrStart, end: attrStart },
                        token: ''
                    }
                }
            }
        }
        /**
         * @example <div class=""></div>
         * */
        if (classAttributes?.length) {
            const classAttributesPatten = classAttributes.join('|')
            for (const eachClassPositionRegex of [
                new RegExp(`(\\s(?:${classAttributesPatten})\\s?=\\s?")([^"]+?)?"`, 'g'),
                new RegExp(`(\\s(?:${classAttributesPatten})\\s?=\\s?')([^']+?)?'`, 'g'),
            ]) {
                let eachClassPostioinMatch: RegExpExecArray | null
                while ((eachClassPostioinMatch = eachClassPositionRegex.exec(text)) !== null) {
                    if ((eachClassPostioinMatch.index <= (positionIndex - startIndex) && eachClassPostioinMatch.index + eachClassPostioinMatch[0].length >= (positionIndex - startIndex)) === true) {
                        const attrStart = eachClassPostioinMatch.index + eachClassPostioinMatch[1].length
                        const eachClassName = eachClassPostioinMatch[2]
                        /**
                         * @example <div class=""></div>
                         */
                        if (eachClassName === undefined) {
                            return {
                                range: { start: attrStart, end: attrStart },
                                token: ''
                            }
                        }
                        const classPosition = normalizeClassNamePosition(eachClassName, attrStart)
                        if (classPosition) return classPosition
                    } else if (eachClassPostioinMatch.index > (positionIndex - startIndex)) {
                        break
                    }
                }
            }
        }
        /**
         * attribute binding
         * @example <div className={''}></div>
         * @example <div :class="isActive ? 'block' : 'hidden'"></div>
         * */
        if (Object.keys(classAssignments || {}).length) {
            const classPositionRegexes = Object.entries(classAssignments || {})
                .map(([assignment, classAssignment]) => {
                    if (classAssignment === false) return
                    const [start, end] = classAssignment
                    return new RegExp(`(\\s${assignment}${start})([^${end}]+?)${end}`, 'g')
                })
                .filter(Boolean) as RegExp[]
            for (const eachClassPositionRegex of classPositionRegexes) {
                let eachClassPostioinMatch: RegExpExecArray | null
                while ((eachClassPostioinMatch = eachClassPositionRegex.exec(text)) !== null) {
                    if ((eachClassPostioinMatch.index <= (positionIndex - startIndex) && eachClassPostioinMatch.index + eachClassPostioinMatch[0].length >= (positionIndex - startIndex)) === true) {
                        const attrStart = eachClassPostioinMatch.index + eachClassPostioinMatch[1].length
                        const eachClassPositionExpression = eachClassPostioinMatch[2]
                        /**
                         * @example <div className={""}></div>
                         */
                        if (['""', '\'\'', '``'].includes(eachClassPositionExpression)) {
                            return {
                                range: { start: attrStart + 1, end: attrStart + 1 },
                                token: ''
                            }
                        }
                        for (const classExpressionMatch of eachClassPositionExpression.matchAll(/(['"`])([\s\S]*?)\1/g)) {
                            if (classExpressionMatch.index === undefined) continue
                            const eachClassName = classExpressionMatch[2]
                            const classNameStart = attrStart + classExpressionMatch.index + classExpressionMatch[1].length
                            const classPosition = normalizeClassNamePosition(eachClassName, classNameStart)
                            if (classPosition) return classPosition
                        }
                    } else if (eachClassPostioinMatch.index > (positionIndex - startIndex)) {
                        break
                    }
                }
            }
        }
    }

    isDocumentAccepted(doc: TextDocument): boolean {
        if (!this.settings.exclude) return true
        for (const exclude of this.settings.exclude) {
            if (minimatch(fileURLToPath(doc.uri), exclude)) {
                return false
            }
        }
        return true
    }
}