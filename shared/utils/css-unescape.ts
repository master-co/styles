export default function cssUnescape(value: string) {
    return value.replace(/\\([0-9a-fA-F]{1,6}\s?|[^0-9a-fA-F])/g, (match, group) => {
        if (/^[0-9a-fA-F]/.test(group)) {
            // Hexadecimal escape sequence
            const hex = group.trim()  // Remove any trailing space
            return String.fromCodePoint(parseInt(hex, 16))
        } else {
            // Simple character escape
            return group
        }
    })
}