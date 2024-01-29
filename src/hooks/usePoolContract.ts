import {useCallback, useEffect, useState} from 'react';
import {useContracts} from './useContracts'; // Import your useContracts hook
import {useMetaMask} from '@/contexts/MetaMaskContext';


const usePoolContract = () => {
    const {poolContract} = useContracts();
    const {account} = useMetaMask(); // Get the current account from MetaMask
    const [isPoolLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPoolReserveData = async (tokenAddress: string): Promise<any> => {
        if (!poolContract) {
            console.error("Contract not initialized.");
            return null;
        }
        try {
            // Invest in Aave Pool
            return await poolContract.getReserveData(tokenAddress);
        } catch (error) {
            console.error("Error fetching pool reserve data:", error);
            return [];
        }
    };


    useEffect(() => {
        if (poolContract) {
            setIsLoading(false); // Set loading state before fetching
        }
    }, [poolContract]);

    return {fetchPoolReserveData, isPoolLoading};
};

export default usePoolContract;
