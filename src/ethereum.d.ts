// src/ethereum.d.ts
// Import the existing types for ethers, if needed
import { ExternalProvider } from 'ethers/providers';
declare global {
    interface Window {
        ethereum?: ExternalProvider;
    }
}
