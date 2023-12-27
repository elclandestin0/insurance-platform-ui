import { ethers } from 'ethers';
import PolicyMaker from '@/contracts/abis/PolicyMaker.json';
import Exploitation from '@/contracts/abis/ExploitationDetector.json';
import Payout from '@/contracts/abis/Payout.json';
import { policyMakerAddress, exploitationAddress, payoutAddress } from '@/contracts/addresses';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const policyMakerContract = new ethers.Contract(
    policyMakerAddress,
    PolicyMaker.abi,
    provider.getSigner()
);

export const exploitationContract = new ethers.Contract(
    exploitationAddress,
    Exploitation.abi,
    provider.getSigner()
);

export const payoutContract = new ethers.Contract(
    payoutAddress,
    Payout.abi,
    provider.getSigner()
);



// Initialize other contract instances similarly
