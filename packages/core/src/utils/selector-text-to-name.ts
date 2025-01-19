export default function selectorTextToName(selectorText: string) {
    return selectorText.slice(1).replace(/\\(.)|[,.#\[!*+~:@\s].*/g, '$1')
}
