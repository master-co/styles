import { indexOfAll } from './index-of-all'

export default function findLoc(text, lines, startLine, startColumn, endLine, endColumn) {
    const targetLines = text.match(/.+(?:\r\n|\n)?/g)

    let checkingTargetLine = 0
    let resultStart = null
    let checking = false

    for (let i = startLine; i <= endLine; i++) {
        const sourceCodeLine = lines[i - 1]
        const content = targetLines[checkingTargetLine].replace(/\r\n|\n/, '')

        const indexes = indexOfAll(sourceCodeLine, content)
        if (indexes.length > 0) {
            for (const index of indexes) {

                if (i === startLine && index < startColumn || i === endLine && index > endColumn) {
                    continue
                }

                if ((index !== 0 && sourceCodeLine[index - 1].match(/\w/)) ||
                    (index + content.length < sourceCodeLine.length && sourceCodeLine[index + content.length].match(/\w/))) {
                    continue
                }

                if (checkingTargetLine === 0) {
                    resultStart = {
                        line: i,
                        column: index
                    }
                }

                if (checkingTargetLine === targetLines.length - 1) {
                    return {
                        start: resultStart,
                        end: {
                            line: i,
                            column: index + text.length
                        }
                    }
                }
                checking = true
                checkingTargetLine++
            }
        } else {
            if (checking) {
                checking = false
                checkingTargetLine = 0
                resultStart = null
            }
        }
    }
    return null
}