import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PolicyMaker from '@/contracts/abis/PolicyMaker.json';
import Exploitation from '@/contracts/abis/ExploitationDetector.json';
import Payout from '@/contracts/abis/Payout.json';
import { policyMakerAddress, exploitationAddress, payoutAddress } from '@/contracts/addresses';
import { Contract } from 'ethers';

interface ContractsState {
    policyMakerContract: Contract | null;
    exploitationContract: Contract | null;
    payoutContract: Contract | null;
}

export function useContracts() {
    const [contracts, setContracts] = useState<ContractsState>({
        policyMakerContract: null,
        exploitationContract: null,
        payoutContract: null,
    });

    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Create contract instances
            const policyMakerContract = new ethers.Contract(
                policyMakerAddress,
                PolicyMaker.abi,
                signer
            );

            const exploitationContract = new ethers.Contract(
                exploitationAddress,
                Exploitation.abi,
                signer
            );

            const payoutContract = new ethers.Contract(
                payoutAddress,
                Payout.abi,
                signer
            );

            // Update state with contracts
            setContracts({
                policyMakerContract,
                exploitationContract,
                payoutContract,
            });
        }
    }, []);

    return contracts;
}
