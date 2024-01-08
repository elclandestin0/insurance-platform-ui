import { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import PolicyMaker from '@/contracts/abis/PolicyMaker.json';
import Payout from '@/contracts/abis/Payout.json';
import { policyMakerAddress, payoutAddress } from '@/contracts/addresses';

export function useContracts() {
    const [policyMakerContract, setPolicyMakerContract] = useState<Contract | null>(null);
    const [payoutContract, setPayoutContract] = useState<Contract | null>(null);

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

                    const payout = new ethers.Contract(
                        payoutAddress,
                        Payout.abi,
                        signer
                    )

                    setPolicyMakerContract(policyMaker);
                    setPayoutContract(payout);
                } catch (error) {
                    console.error('Error initializing contracts:', error);
                }
            } else {
                console.error('MetaMask is not installed!');
            }
        };

        initializeContracts();
    }, []);

    return { policyMakerContract, payoutContract };
}
