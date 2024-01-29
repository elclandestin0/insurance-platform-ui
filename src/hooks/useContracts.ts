import {useState, useEffect} from 'react';
import {ethers, Contract} from 'ethers';
import PolicyMaker from '@/contracts/abis/PolicyMaker.json';
import IPool from '@/contracts/abis/IPool.json';
import IERC20 from '@/contracts/abis/IERC20.json';
import {aavePoolAddress, aWethAddress, policyMakerAddress} from '@/contracts/addresses';

export function useContracts() {
    const [policyMakerContract, setPolicyMakerContract] = useState<Contract | null>(null);
    const [poolContract, setPoolContract] = useState<Contract | null>(null);
    const [aWethContract, setAwethContract] = useState<Contract | null>(null);
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

                    const aWeth = new ethers.Contract(
                        aWethAddress,
                        IERC20.abi,
                        signer
                    );

                    const pool = new ethers.Contract(
                        aavePoolAddress,
                        IPool.abi,
                        signer
                    )

                    setAwethContract(aWeth);
                    setPoolContract(pool);
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

    return {policyMakerContract, aWethContract, poolContract};
}
