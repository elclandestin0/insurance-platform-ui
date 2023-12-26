import { ethers } from 'ethers';
import PolicyMaker from '@/contracts/abis/PolicyMaker.json';
import Exploitation from '@/contracts/abis/ExploitationDetector.json';
import Payout from '@/contracts/abis/Payout.json';
import { policyMakerAddress, exploitationAddress, payoutAddress } from '@/contracts/addresses';

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

export const policyMakerContract = new ethers.Contract(
    policyMakerAddress,
    PolicyMaker.abi,
    provider
);

export const exploitationContract = new ethers.Contract(
    exploitationAddress,
    Exploitation.abi,
    provider
);

export const payoutContract = new ethers.Contract(
    payoutAddress,
    Payout.abi,
    provider
);



// Initialize other contract instances similarly
