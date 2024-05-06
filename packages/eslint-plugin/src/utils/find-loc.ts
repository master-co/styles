
export default function findLoc(text, lines, startLine, endLine) {
    const targetLines = text.match(/.+(?:\r\n|\n)?/g)

    let checkingTargetLine = 0
    let resultStart = null
    let checking = false

    for (let i = startLine; i <= endLine; i++) {
        const sourceCodeLine = lines[i - 1]
        const content = targetLines[checkingTargetLine].replace(/\r\n|\n/, '')
        const index = sourceCodeLine.indexOf(content)
        if (index !== -1) {
            if (index === 0 || sourceCodeLine[index - 1].match(/^|[\s"'']/)) {
                if (checkingTargetLine === 0) {
                    resultStart = {
                        line: i,
                        column: index
                    }
                }
                if (checkingTargetLine === targetLines.length - 1 && (sourceCodeLine[index + content.length - 1].match(/$|[\s"'']/) || sourceCodeLine[index + content.length].match(/[\s"'']/))) {
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