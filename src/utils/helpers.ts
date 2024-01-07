export function truncateToDecimalPlace(num: number, digits: number): string {
    const re = new RegExp('^-?\\d+(?:\\.\\d{0,' + digits + '})?');
    const match = num.toString().match(re);
    return match ? match[0] : num.toString();
}

export function convertEpochToReadableDate(epoch: number): string {
    const date = new Date(epoch * 1000); 
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
}