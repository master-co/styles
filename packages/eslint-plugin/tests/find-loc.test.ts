import findLoc from '../src/utils/find-loc'

describe('findLoc', () => {
    it('Causes incorrect class selection when there is only one character #345', () => {
        const text = 'f'
        const lines = ['font:12 font:24@sm m:32 block font:32@md mb:48 f', 'bg:indigo font:']
        const result = findLoc(text, lines, 1, 2)
        expect(result).toEqual({ start: { line: 1, column: 47 }, end: { line: 1, column: 48 } })
    })
})