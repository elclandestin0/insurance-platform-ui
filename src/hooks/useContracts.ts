import { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import PolicyMaker from '@/contracts/abis/PolicyMaker.json';
import { policyMakerAddress } from '@/contracts/addresses';

export function useContracts() {
    const [policyMakerContract, setPolicyMakerContract] = useState<Contract | null>(null);

    useEffect(() => {
        const initializeContracts = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const policyMaker = new ethers.Contract(
                        policyMakerAddress,
                        PolicyMaker.abi,
                        signer
                    );

                    setPolicyMakerContract(policyMaker);
                } catch (error) {
                    console.error('Error initializing contracts:', error);
                }
            } else {
                console.error('MetaMask is not installed!');
            }
        };

        initializeContracts();
    }, []);

    return { policyMakerContract };
}
