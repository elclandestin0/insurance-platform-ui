import { useCallback } from 'react';
import { useContracts } from './useContracts'; // Import your useContracts hook
import { useMetaMask } from '@/contexts/MetaMaskContext';
import { BigNumber, ethers } from "ethers"; // Import the MetaMask context


const usePayoutContract = () => {
    const { payoutContract } = useContracts();
    const { account } = useMetaMask(); // Get the current account from MetaMask

    const processClaim = useCallback(async (policyId: any, claimAmount: any) => {
        if (!payoutContract || !policyId || !claimAmount) {
            console.error("Contract not initialized or invalid parameters.");
            return;
        }
        try {
            const transaction = await payoutContract.processClaim(policyId, account, {
                from: account,
                value: claimAmount
            });
            await transaction.wait(); // Wait for the transaction to be mined
            console.log('Claimed successfully');
        } catch (err) {
            console.error('Error claiming:', err);
        }
    }, [payoutContract, account]);

    // useEffect(() => {
    //     if (policyMakerContract) {
    //         setIsLoading(true); // Set loading state before fetching
    //     }
    // }, [policyMakerContract]);

    return { processClaim };
};

export default usePayoutContract;
