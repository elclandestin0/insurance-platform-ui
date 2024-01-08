import { ethers, BigNumber } from "ethers";
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

function getDecimalPlaces(value: BigNumber) {
    // Convert the BigNumber to a string
    const valueString = ethers.utils.formatEther(value);
    
    // Split the string on the decimal point
    const parts = valueString.split('.');
    
    // Return the length of the string after the decimal point
    // If there is no decimal point, return 0
    return parts.length > 1 ? parts[1].length : 0;
  }

export function formatToWeiIfMoreThanThreeDecimalPlaces(value: BigNumber): string {
    const decimalPlaces = getDecimalPlaces(value);
    // Check if the value has more than three decimal places
    if (decimalPlaces > 3) {
      // Convert to WEI
      console.log(decimalPlaces);
      return ethers.utils.formatUnits(value, 'wei') + ` wei`;
    } else {
      return ethers.utils.formatEther(value) + `<Icon as={FaEthereum} />`;
    }
  }