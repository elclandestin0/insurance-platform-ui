// helpers.ts

/**
 * Truncates a number to a specified number of decimal places without rounding.
 *
 * @param {number} num - The number to truncate.
 * @param {number} digits - The number of decimal places to truncate to.
 * @returns {string} - The truncated number as a string.
 */
export function truncateToDecimalPlace(num: number, digits: number): string {
    const re = new RegExp('^-?\\d+(?:\\.\\d{0,' + digits + '})?');
    const match = num.toString().match(re);
    return match ? match[0] : num.toString();
}
