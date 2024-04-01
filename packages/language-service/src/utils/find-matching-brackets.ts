export default function findMatchingPairs(input: string, startIndex: number, start: string, end: string) {
    let count = 0
    let endIndex

    // {} [] ()
    if (start !== end) {
        for (let i = startIndex; i < input.length; i++) {
            if (input[i] === start) {
                count++
            } else if (input[i] === end) {
                count--
                if (count === 0) {
                    endIndex = i
                    break
                }
            }
        }
    }
    // "" ''
    else {
        for (let i = startIndex; i < input.length; i++) {
            if (input[i] === start && input[i - 1] !== '\\') {
                count++
                endIndex = i
            }
        }
        if (count % 2 !== 0) return
    }
    return endIndex
}