export function parseNumber(str: string) {
    const regex = /\d+/;
    const match = str.match(regex);

    if (match) {
        const number = parseInt(match[0], 10);
        return number
    } else {
        console.error("No number found in the string.");
        return undefined
    }
}